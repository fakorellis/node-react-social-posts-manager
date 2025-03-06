import { Types } from 'mongoose'
import LikeRepository from '../repositories/LikeRepository'

class PostTransformer {
  /**
   * Transforms a single Post object into a PostResource (without `isLiked`).
   * @param post - The post to transform.
   * @returns A transformed PostResource.
   */
  static getView(post: Post): PostResource {
    return {
      _id: post._id ? new Types.ObjectId(post._id).toString() : undefined,
      title: post.title,
      body: post.body
    }
  }

  /**
   * Transforms a single Post object into a PostResourceWithLike (with `isLiked`).
   * @param post - The post to transform.
   * @param isLiked - Whether the post is liked by the user.
   * @returns A transformed PostResourceWithLike.
   */
  static getViewWithLike(post: Post, isLiked = false): PostResourceWithLike {
    return {
      ...this.getView(post),
      isLiked
    }
  }

  /**
   * Transforms a list of Post objects into PostResource[] (without `isLiked`).
   * Calls getView() for each post.
   * @param posts - The list of posts to transform.
   * @returns A transformed list of PostResources.
   */
  static getViewList(posts: Post[]): PostResource[] {
    return posts.map((post) => this.getView(post))
  }

  /**
   * Transforms a list of Post objects into PostResourceWithLike[] (with `isLiked`).
   * Calls getViewWithLike() for each post, checking if it has been liked.
   * @param userId - The ID of the authenticated user.
   * @param posts - The list of posts to transform.
   * @returns A transformed list of PostResourceWithLike[].
   */
  static async getViewListWithLikeStatus(userId: string, posts: Post[]): Promise<PostResourceWithLike[]> {
    const postIds = posts.map((post) => post._id.toString())

    // Fetch liked post IDs
    const likedPostIds = await LikeRepository.checkIfPostsAreLiked(userId, postIds)

    return posts.map((post) => this.getViewWithLike(post, likedPostIds.has(post._id.toString())))
  }
}

export default PostTransformer
