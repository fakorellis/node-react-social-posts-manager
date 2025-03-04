import { OpenAPIBackend } from 'openapi-backend'

import openApiEndpoints from '../../api/routes/index'
import errorHandler from './handlers/errorHandler'
import responseHandler from './handlers/responseHandler'
import validationFailHandler from './handlers/validationFailHandler'
import Error from '../../core/errors/errorCodes'
// import postResponseHandler from './handlers/postResponseHandler'
import Logger from '../logger'
import { HttpStatus, LogLevel } from '../../core/enums'

export default async function initOpenApi(app: Express.Application, endpoints?: unknown): Promise<void> {
  // Initialize the library.
  const api = getOpenApi(endpoints)
  // And register the handlers.
  api.register('validationFail', validationFailHandler)
  // api.register('postResponseHandler', postResponseHandler)
  await api.init()

  const operations = api.getOperations()
  operations.forEach((operation) => {
    const { operationId, method, path } = operation
    const expressPath = path.replace(/{/g, ':').replace(/}/g, '')
    const endpoint = openApiEndpoints[operationId]
    // Logger.log(`Path ${method} ${expressPath} bound with operation: ${operationId}`)
    // We need to assign the preOperationMiddlewares as express middlewares.
    app[method](expressPath, ...endpoint.preOperationMiddlewares, async (req, res) => {
      try {
        await api.handleRequest(req, req, res)
      } catch (error) {
        Logger.log(LogLevel.ERROR, error)
        if (!res.headersSent) {
          res.status(500).json(Error.GENERIC__ERROR)
        }
      }
    })
  })
}

export function getOpenApi(endpoints?: unknown): OpenAPIBackend {
  // Load all handlers and organize them by handler.
  const handlers = Object.keys((endpoints || {}) && openApiEndpoints)
  const map = handlers.reduce((acc, handler) => {
    // Need to wrap the handler, with the response and error handler, so to:
    // 1. have a generic error handling
    // 2. to make the response consistent.
    acc[`${handler}`] = errorHandler(responseHandler(openApiEndpoints[handler].handler))
    return acc
  }, {})

  console.log(`${__dirname}/../../api/openapi.yaml`)

  return new OpenAPIBackend({
    // eslint-disable-next-line n/no-path-concat
    definition: `${__dirname}/../../api/openapi.yaml`,
    handlers: map
  })
}
