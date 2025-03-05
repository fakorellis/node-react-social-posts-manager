import { HttpStatus } from '../../../core/enums'
import PostService from '../../../core/services/PostService'
import PostTransformer from '../../../core/transformers/PostTransformer'
import AuthMiddlewareService from '../../middlewares/AuthMiddlewareService'

/**
 * Returns the paginated posts.
 */
async function getPostsPaginatedHandler(
  req: Express.ExpressRequest
): Promise<ApiResponse.PaginatedResponse<PostResource[]>> {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10

  const paginatedPosts = await PostService.getPostsPaginated(page, limit)
  const data = PostTransformer.getViewList(paginatedPosts.data)

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

export default {
  getPostsPaginated: {
    name: 'getPostsPaginated',
    handler: getPostsPaginatedHandler,
    preOperationMiddlewares: []
  },
  createPost: {
    name: 'createPost',
    handler: createPostHandler,
    preOperationMiddlewares: [AuthMiddlewareService.isAuthenticated]
  }
}
