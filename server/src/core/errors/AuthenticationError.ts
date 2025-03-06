import AbstractHttpError from './AbstractHttpError'

export default class AuthenticationError extends AbstractHttpError {
  errorCode: string
  params?: any

  constructor(errorCode, params?) {
    super(errorCode?.userMessage || errorCode?.userTitle)
    this.name = this.constructor.name
    this.errorCode = errorCode
    this.params = params
    Object.setPrototypeOf(this, AuthenticationError.prototype)
  }
}
