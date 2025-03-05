declare namespace Express {
  type ExpressRequest = import('express').Request & {
    accessToken: string
    user: User
  }
  type ExpressResponse = import('express').Response
  type NextFunction = import('express').NextFunction
}
