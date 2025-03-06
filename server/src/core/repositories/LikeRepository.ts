import LikeModel from '../models/LikeModel'
import Logger from '../../services/logger'
import { LogLevel } from '../enums'
import mongoose from 'mongoose'

class LikeRepository {
  /**
   * Finds a like by userId and postId.
   */
  static async findLike(userId: string, postId: string): Promise<Like> {
    return await LikeModel.findOne({ userId, postId }).lean()
  }

  /**
   * Adds a like to the database.
   */
  static async addLike(userId: string, postId: string): Promise<Like> {
    const like = await LikeModel.create({ userId, postId })
    Logger.log(LogLevel.INFO, `User ${userId} liked post ${postId}`)
    return like.toObject()
  }

  /**
   * Removes a like from the database.
   */
  static async removeLike(userId: string, postId: string): Promise<void> {
    await LikeModel.deleteOne({ userId, postId })
    Logger.log(LogLevel.INFO, `User ${userId} unliked post ${postId}`)
  }

  /**
   * Gets all liked posts of a user (with pagination).
   */
  static async getLikedPosts(userId: string, page = 1, limit = 10): Promise<PaginationResponse<Post[]>> {
    const skip = (page - 1) * limit

    // Get total liked posts count
    const totalItems = await LikeModel.countDocuments({ userId })

    // Aggregation to join with the posts collection
    const posts = await LikeModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // Filter by user
      {
        $lookup: {
          from: 'posts', // Collection name
          localField: 'postId',
          foreignField: '_id',
          as: 'postDetails'
        }
      },
      { $unwind: '$postDetails' }, // Convert array to object
      { $replaceRoot: { newRoot: '$postDetails' } }, // Only keep post details
      { $sort: { createdAt: -1 } }, // Sort by like date (most recent first)
      { $skip: skip },
      { $limit: limit }
    ])

    return {
      data: posts,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    }
  }

  /**
   * Retrieves liked post IDs for a given user.
   * @param userId - The ID of the authenticated user.
   * @param postIds - Array of post IDs to check.
   * @returns A Set of post IDs that are liked.
   */
  static async checkIfPostsAreLiked(userId: string, postIds: string[]): Promise<Set<string>> {
    const likedPosts = await LikeModel.find({
      userId: userId,
      postId: { $in: postIds }
    }).select('postId')

    return new Set(likedPosts.map((like) => like.postId.toString()))
  }

  /**
   * Removes likes based on criteria.
   * @param criteria - The filter conditions for deleting likes.
   */
  static async deleteByCriteria(criteria: Record<string, any>): Promise<void> {
    await LikeModel.deleteMany(criteria)
    Logger.log(LogLevel.INFO, `Likes deleted for criteria: ${JSON.stringify(criteria)}`)
  }
}

export default LikeRepository
