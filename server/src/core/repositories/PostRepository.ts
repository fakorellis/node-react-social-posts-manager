import Logger from '../../services/logger'
import { LogLevel } from '../enums'
import PostModel from '../models/PostModel'

/**
 * Repository for handling CRUD operations related to posts.
 */
class PostRepository {
  /**
   * Creates a new post in the database.
   * @param postData - Object containing post details.
   * @returns The created post document.
   * @throws An error if post creation fails.
   */
  static async createPost(postData: Post) {
    try {
      const post = await PostModel.create(postData)
      Logger.log(LogLevel.INFO, `Post created: ${post.title}`)
      return post.toObject()
    } catch (error) {
      Logger.log(LogLevel.ERROR, `Error creating post: ${error.message}`)
      throw error
    }
  }

  /**
   * Counts the total number of posts in the database.
   * @returns The total number of posts.
   */
  static async countPosts(): Promise<number> {
    return await PostModel.countDocuments()
  }

  /**
   * Inserts multiple posts into the database in bulk.
   * @param posts - Array of posts to insert.
   * @returns The inserted posts.
   */
  static async insertMany(posts: Post[]) {
    return await PostModel.insertMany(posts)
  }

  /**
   * Retrieves posts with pagination.
   * @param page - Page number (default: 1).
   * @param limit - Number of posts per page (default: 20).
   * @param searchQuery - Search term for filtering posts by title or body.
   * @returns Paginated posts along with total count.
   */
  static async getPostsPaginated(page = 1, limit = 20, searchQuery?: string): Promise<PaginationResponse<Post[]>> {
    const skip = (page - 1) * limit

    // Construct search filter if query is provided
    const searchFilter = searchQuery
      ? { $or: [{ title: { $regex: searchQuery, $options: 'i' } }, { body: { $regex: searchQuery, $options: 'i' } }] }
      : {}

    const posts = <Post[]>await PostModel.find(searchFilter).skip(skip).limit(limit).lean()
    const totalPosts = await PostModel.countDocuments(searchFilter)

    return {
      data: posts,
      totalItems: totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page
    }
  }

  /**
   * Finds a post by its ID.
   * @param postId - The ID of the post.
   * @returns The post document or null if not found.
   */
  static async findPostById(postId: string): Promise<Post | null> {
    return PostModel.findById(postId).lean()
  }
}

export default PostRepository
