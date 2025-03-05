import { HttpStatus } from '../../../core/enums'
import UserService from '../../../core/services/UserService'

/**
 * Handler for user registration
 */
async function registerUserHandler(req: Express.ExpressRequest) {
  const newUser = await UserService.registerUser(req.body)

  return {
    status: HttpStatus.CREATED,
    data: newUser
  }
}

/**
 * Handler for user login
 */
async function loginUserHandler(req: Express.ExpressRequest) {
  const request: UserLoginRequest = req.body
  const token = await UserService.loginUser(request)

  return {
    status: HttpStatus.OK,
    data: token
  }
}

export default {
  registerUser: {
    name: 'registerUser',
    handler: registerUserHandler,
    preOperationMiddlewares: []
  },
  loginUser: {
    name: 'loginUser',
    handler: loginUserHandler,
    preOperationMiddlewares: []
  }
}
