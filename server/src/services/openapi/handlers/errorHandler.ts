import { Request, Response } from 'express'
import { cloneDeep, omit } from 'lodash'
import Error from '../../../core/errors/errorCodes'
import ValidationError from '../../../core/errors/ValidationError'
import ResourceNotFoundError from '../../../core/errors/ResourceNotFoundError'
import AuthenticationError from '../../../core/errors/AuthenticationError'
import BadRequestError from '../../../core/errors/BadRequestError'
import { HttpStatus, LogLevel } from '../../../core/enums'
import Logger from '../../logger'

function errorHandler(fn) {
  return async (c: OpenApiBackend.OpenApiContext, req: Request, res: Response) => {
    return fn(c, req, res).catch((error) => {
      const { errorCode } = error
      const { params } = error
      const responseCode = errorCode || Error.GENERIC__ERROR
      const responseCodeWithParams = Object.assign(cloneDeep(responseCode), { params })

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

      // Log the failure using our logger
      Logger.log(logLevel, `Request ${req.method} ${req.path} failed`, responseCode.code, status)
      // And respond.
      return res.status(status).json(responseCodeWithParams)
    })
  }
}

export default errorHandler
