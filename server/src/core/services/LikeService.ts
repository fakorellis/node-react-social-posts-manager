import LikeRepository from '../repositories/LikeRepository'

class LikeService {
  /**
   * Toggles like/unlike for a post.
   * @param userId - The ID of the user performing the action.
   * @param postId - The ID of the post to like/unlike.
   * @returns A message indicating whether the post was liked or unliked.
   */
  static async toggleLikePost(userId: string, postId: string): Promise<void> {
    const existingLike = await LikeRepository.findLike(userId, postId)

    if (existingLike) {
      // Unlike (Remove from collection)
      await LikeRepository.removeLike(userId, postId)
      return
    }
    // Like (Add to collection)
    await LikeRepository.addLike(userId, postId)
  }

  /**
   * Gets all liked posts of a user (with pagination).
   */
  static async getUserLikedPosts(userId: string, page: number, limit: number): Promise<PaginationResponse<Post[]>> {
    return LikeRepository.getLikedPosts(userId, page, limit)
  }
}

export default LikeService
