import { Request, Response } from 'express'

export default function responseHandler(fn) {
  return async (c: OpenApiBackend.OpenApiContext, req: Request, res: Response) => {
    const dataResponse = await fn(c, req, res)

    // Assign response to context
    Object.assign(c, { dataResponse })

    // ✅ Ensure response is sent only if headers haven't been sent already
    if (!res.headersSent) {
      res.status(200).json(dataResponse)
    }
  }
}
