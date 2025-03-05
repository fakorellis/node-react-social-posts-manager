import { HttpStatus } from '../../../core/enums'
import PostService from '../../../core/services/PostService'
import PostTransformer from '../../../core/transformers/PostTransformer'

/**
 * Returns the paginated posts.
 */
async function getPostsPaginatedHandler(req: Express.ExpressRequest): Promise<ApiResponse.PaginatedResponse<PostResource[]>> {
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

export default {
  getPostsPaginated: {
    name: 'getPostsPaginated',
    handler: getPostsPaginatedHandler,
    preOperationMiddlewares: []
  }
}
