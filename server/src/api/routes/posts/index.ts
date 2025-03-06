import { HttpStatus } from '../../../core/enums'
import LikeService from '../../../core/services/LikeService'
import PostService from '../../../core/services/PostService'
import PostTransformer from '../../../core/transformers/PostTransformer'
import AuthMiddlewareService from '../../middlewares/AuthMiddlewareService'

/**
 * Returns the paginated posts.
 */
async function getPostsPaginatedHandler(
  req: Express.ExpressRequest
): Promise<ApiResponse.PaginatedResponse<PostResource[]>> {
  const userId = req.user?._id
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10

  const paginatedPosts = await PostService.getPostsPaginated(page, limit)
  const data = await PostTransformer.getViewListWithLikeStatus(userId, paginatedPosts.data)

  return {
    status: HttpStatus.OK,
    ...paginatedPosts,
    data
  }
}

/**
 * Handles the creation of a new post.
 */
async function createPostHandler(req: Express.ExpressRequest): Promise<ApiResponse.Response<Post>> {
  const postRequest = req.body

  const newPost = await PostService.createPost(req.user, postRequest)
  const data = PostTransformer.getView(newPost)

  return {
    status: HttpStatus.CREATED,
    data
  }
}

/**
 * Retrieves the user's liked posts with pagination.
 */
async function getUserLikedPostsHandler(
  req: Express.ExpressRequest
): Promise<ApiResponse.PaginatedResponse<PostResource[]>> {
  const userId = req.user?._id
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10

  const paginatedLikedPosts = await LikeService.getUserLikedPosts(userId, page, limit)
  const data = PostTransformer.getViewList(paginatedLikedPosts.data)

  return {
    status: HttpStatus.OK,
    ...paginatedLikedPosts,
    data
  }
}

/**
 * Handles liking or unliking a post.
 */
async function likePostHandler(req: Express.ExpressRequest): Promise<{ status: HttpStatus }> {
  const userId = req.user?._id
  const postId = req.params.id

  await LikeService.toggleLikePost(userId, postId)

  return { status: HttpStatus.OK }
}

/**
 * Handles the deletion of al liked posts of a user.
 */
async function unlikeAllPostsHandler(req: Express.ExpressRequest): Promise<ApiResponse.Response<void>> {
  await LikeService.unlikeAllPosts(req.user._id)
  return { status: HttpStatus.NO_CONTENT }
}

export default {
  getPostsPaginated: {
    name: 'getPostsPaginated',
    handler: getPostsPaginatedHandler,
    preOperationMiddlewares: [AuthMiddlewareService.isAuthenticated]
  },
  createPost: {
    name: 'createPost',
    handler: createPostHandler,
    preOperationMiddlewares: [AuthMiddlewareService.isAuthenticated]
  },
  getUserLikedPosts: {
    name: 'getUserLikedPosts',
    handler: getUserLikedPostsHandler,
    preOperationMiddlewares: [AuthMiddlewareService.isAuthenticated]
  },
  likePost: {
    name: 'likePost',
    handler: likePostHandler,
    preOperationMiddlewares: [AuthMiddlewareService.isAuthenticated]
  },
  unlikeAllPosts: {
    name: 'unlikeAllPosts',
    handler: unlikeAllPostsHandler,
    preOperationMiddlewares: [AuthMiddlewareService.isAuthenticated]
  }
}
