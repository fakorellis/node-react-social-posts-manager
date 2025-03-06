import { Cacheable, CacheClear } from '@type-cacheable/core'
import { HashKey, HashKeyTTL } from '../enums'
import LikeRepository from '../repositories/LikeRepository'

class LikeService {
  /**
   * Toggles like/unlike for a post.
   * @param userId - The ID of the user performing the action.
   * @param postId - The ID of the post to like/unlike.
   * @returns A message indicating whether the post was liked or unliked.
   */
  @CacheClear({
    hashKey: HashKey.USER_GET_LIKED_POSTS
  })
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
  @Cacheable({
    hashKey: HashKey.USER_GET_LIKED_POSTS,
    ttlSeconds: HashKeyTTL[HashKey.USER_GET_LIKED_POSTS],
    cacheKey: (args) => `${args[0]}|page=${args[1]}|limit=${args[2]}`
  })
  static async getUserLikedPosts(userId: string, page: number, limit: number): Promise<PaginationResponse<Post[]>> {
    return LikeRepository.getLikedPosts(userId, page, limit)
  }
}

export default LikeService
