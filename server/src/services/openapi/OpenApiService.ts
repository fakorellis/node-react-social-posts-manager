import express, { Request, Response, NextFunction } from 'express'
import YAML from 'yamljs'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import { HttpStatus, LogLevel } from '../../core/enums'
import handlers from '../../api/routes'
import ErrorCodes from '../../core/errors/errorCodes'
import AbstractHttpError from '../../core/errors/AbstractHttpError'
import ValidationError from '../../core/errors/ValidationError'
import ResourceNotFoundError from '../../core/errors/ResourceNotFoundError'
import AuthenticationError from '../../core/errors/AuthenticationError'
import BadRequestError from '../../core/errors/BadRequestError'

class OpenApiService {
  static setupRoutes(app: express.Application) {
    const openApiPath = path.join(__dirname, '../../api/openapi.yaml')
    const apiSpec = YAML.load(openApiPath)

    Object.entries(apiSpec.paths).forEach(([routePath, methods]) => {
      Object.entries(methods as Record<string, any>).forEach(([method, operation]) => {
        const operationId = operation.operationId
        const handlerDefinition = handlers[operationId]

        if (!handlerDefinition) {
          console.warn(`No handler found for operation: ${operationId}`)
          return
        }

        const { handler, preOperationMiddlewares = [] } = handlerDefinition
        const expressMethod = method.toLowerCase() as keyof express.Router

        if (!app[expressMethod]) {
          console.warn(`Unsupported HTTP method: ${method} for ${routePath}`)
          return
        }

        // @ts-ignore
        app[expressMethod](
          routePath,
          ...preOperationMiddlewares.map(
            (middleware) => (req: Request, res: Response, next: NextFunction) => middleware(req, res, next)
          ),
          async (req: Request, res: Response) => {
            try {
              const response = await handler(req)
              res.status(response.status || HttpStatus.OK).json(response || {})
            } catch (error) {
              console.error(`Error in handler ${operationId}:`, error)
              OpenApiService.handleError(error, res)
            }
          }
        )

        console.log(`Registered route: [${method.toUpperCase()}] ${routePath}`)
      })
    })
  }

  static handleError(error: AbstractHttpError, res) {
    let status = HttpStatus.INTERNAL_ERROR
    let logLevel = LogLevel.ERROR
    // Create http status code and log lever by custom error type
    if (error instanceof ValidationError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY
      logLevel = LogLevel.WARN
    } else if (error instanceof ResourceNotFoundError) {
      status = HttpStatus.NOT_FOUND
      logLevel = LogLevel.WARN
    } else if (error instanceof AuthenticationError) {
      status = HttpStatus.UNAUTHORIZED
      logLevel = LogLevel.WARN
    } else if (error instanceof BadRequestError) {
      status = HttpStatus.BAD_REQUEST
      logLevel = LogLevel.WARN
    }
    const errorMessage = status === HttpStatus.INTERNAL_ERROR ? ErrorCodes.GENERIC_ERROR : error
    res.status(status).json(errorMessage)
  }

  /**
   * Sets up Swagger UI documentation.
   */
  static setupSwaggerDocs(app: express.Application) {
    const openApiPath = path.join(__dirname, '../../api/openapi.yaml')
    const apiSpec = YAML.load(openApiPath)

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpec))
    console.log('Swagger UI available at /api-docs')
  }
}

export default OpenApiService
