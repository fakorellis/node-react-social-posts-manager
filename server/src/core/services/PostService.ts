import axios from 'axios'
import PostRepository from '../repositories/PostRepository'
import Logger from '../../services/logger'
import { LogLevel } from '../enums'

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
}

export default PostService
