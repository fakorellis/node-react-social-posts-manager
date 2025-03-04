import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/enums'

export default function validationFailHandler(
  c: OpenApiBackend.OpenApiContext,
  req: Request,
  res: Response
): Response {
  return res.status(HttpStatus.BAD_REQUEST).json({ status: HttpStatus.BAD_REQUEST, err: c.validation.errors })
}
