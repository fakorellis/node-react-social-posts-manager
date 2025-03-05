import { HttpStatus } from '../../../core/enums'
import AuthMiddlewareService from '../../middlewares/AuthMiddlewareService'

/**
 * Returns the status.
 */
async function getStatusHandler(): Promise<ApiResponse.Response<void>> {
  return {
    status: HttpStatus.OK
  }
}

export default {
  getStatus: {
    name: 'getStatus',
    handler: getStatusHandler,
    preOperationMiddlewares: []
  }
}
