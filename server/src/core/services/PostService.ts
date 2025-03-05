import axios from 'axios'
import { isEmpty, trim } from 'lodash'

import PostRepository from '../repositories/PostRepository'
import Logger from '../../services/logger'
import { LogLevel } from '../enums'
import ErrorCodes from '../errors/errorCodes'
import ValidationError from '../errors/ValidationError'

/**
 * Service for managing post-related business logic.
 */
class PostService {
  /**
   * Fetches 100 sample posts from an external API and stores them in the database.
   * Prevents fetching if at least 100 posts already exist in the database.
   */
  static async fetchPostsFromApi(): Promise<void> {
    const API_URL = 'https://jsonplaceholder.typicode.com/posts'
    const MIN_POSTS_COUNT = 100
    const existingPostCount = await PostRepository.countPosts()
    if (existingPostCount >= MIN_POSTS_COUNT) {
      Logger.log(LogLevel.INFO, 'Skipping API fetch: 100+ posts already exist.')
      return
    }

    Logger.log(LogLevel.INFO, 'Fetching posts from external API...')
    const response = await axios.get<Partial<Post[]>>(API_URL)
    const posts = response.data.map((post) => ({
      title: post.title,
      body: post.body
    }))

    await PostRepository.insertMany(posts)
    Logger.log(LogLevel.INFO, `Fetched and stored ${posts.length} posts.`)
  }

  /**
   * Retrieves posts with pagination.
   * @param page - Page number.
   * @param limit - Number of posts per page.
   * @returns Paginated posts.
   */
  static async getPostsPaginated(page: number, limit: number) {
    return await PostRepository.getPostsPaginated(page, limit)
  }

  /**
   * Creates a new post and saves it in the database.
   * @param postData - Object containing post details.
   * @returns The created post.
   */
  static async createPost(user: User, postRequest: Post): Promise<Post> {
    const title = trim(postRequest.title)
    const body = trim(postRequest.body)

    // Validate that title and body are not empty
    if (isEmpty(title) || isEmpty(body)) {
      throw new ValidationError(ErrorCodes.MISSING_POST_FIELDS)
    }

    const postData: Post = {
      ...postRequest,
      userId: user._id
    }
    return PostRepository.createPost(postData)
  }

  /**
   * Finds a post by ID or throws an error if not found.
   * @param postId - The ID of the post.
   * @returns The post document.
   * @throws ValidationError if the post does not exist.
   */
  static async findPostByIdOrThrowError(postId: string): Promise<Post> {
    const post = await PostRepository.findPostById(postId)
    if (!post) {
      throw new ValidationError(ErrorCodes.POST_NOT_FOUND)
    }
    return post
  }
}

export default PostService
