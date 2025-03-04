import { HttpStatus } from '../../../core/enums'

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
