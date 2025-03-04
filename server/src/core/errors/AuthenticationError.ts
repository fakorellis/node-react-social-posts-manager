export default class AuthenticationError extends Error {
  message: string

  constructor(message: string) {
    super(message)
    Error.call(this)
    this.message = message
    Object.setPrototypeOf(this, AuthenticationError.prototype)
  }
}
