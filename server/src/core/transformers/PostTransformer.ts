import { Types } from 'mongoose'

class PostTransformer {
  /**
   * Transforms a single Post object into a PostResource.
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
   * Transforms a list of Post objects into PostResource[].
   * Calls getView() for each post.
   * @param posts - The list of posts to transform.
   * @returns A transformed list of PostResources.
   */
  static getViewList(posts: Post[]): PostResource[] {
    return posts.map((post) => this.getView(post))
  }
}

export default PostTransformer
