import { HttpStatus } from '../../../core/enums'
import UserService from '../../../core/services/UserService'
import UserTransformer from '../../../core/transformers/UserTransformer'
import AuthMiddlewareService from '../../middlewares/AuthMiddlewareService'

/**
 * Handler for user registration
 */
async function registerUserHandler(req: Express.ExpressRequest) {
  const newUser = await UserService.registerUser(req.body)
  const data = UserTransformer.getView(newUser)

  return {
    status: HttpStatus.CREATED,
    data
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

/**
 * Returns the authenticated user's profile.
 */
async function getUserProfileHandler(req: Express.ExpressRequest) {
  const user = await UserService.getUserById(req.user._id)
  const data = UserTransformer.getView(user)

  return {
    status: HttpStatus.OK,
    data
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
  },
  getUserProfile: {
    name: 'getUserProfile',
    handler: getUserProfileHandler,
    preOperationMiddlewares: [AuthMiddlewareService.isAuthenticated],
  }
}
