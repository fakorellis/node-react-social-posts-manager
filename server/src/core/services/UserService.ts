import bcrypt from 'bcryptjs'
import { LogLevel } from '../enums'
import Logger from '../../services/logger'
import UserRepository from '../repositories/UserRepository'
import UserUtils from './utils/UserUtils'
import JwtService from '../../services/jwt/JwtService'
import ValidationError from '../errors/ValidationError'
import ErrorCodes from '../errors/errorCodes'

class UserService {
  /**
   * Registers a new user.
   */
  static async registerUser(userData: User): Promise<User> {
    // Sanitize user data (trim whitespace)
    userData = UserUtils.sanitizeUserData(userData)

    // Validate required fields
    UserUtils.validateRequiredFieldsOrThrowError(userData, ['email', 'password', 'firstName', 'lastName', 'username'])

    // Validate email format
    if (!UserUtils.isValidEmail(userData.email)) throw new ValidationError(ErrorCodes.INVALID_EMAIL)

    // Ensure password is strong
    if (!UserUtils.isStrongPassword(userData.password)) throw new ValidationError(ErrorCodes.WEAK_PASSWORD)

    // Check if username is taken
    const existingUser = await UserRepository.getUserByUsername(userData.username)
    if (existingUser) {
      throw new ValidationError(ErrorCodes.USERNAME_TAKEN)
    }

    // Check if email is already registered
    const existingEmail = await UserRepository.findByCriteria({ email: userData.email })
    if (existingEmail.length > 0) {
      throw new ValidationError(ErrorCodes.EMAIL_ALREADY_REGISTERED)
    }

    // Create new user
    const newUser = await UserRepository.createUser(userData)
    Logger.log(LogLevel.INFO, `User registered: ${newUser.username}`)

    return newUser
  }

  /**
   * Authenticates user and returns JWT token.
   */
  static async loginUser(userData: UserLoginRequest): Promise<{ token: string }> {
    const { username, password } = userData
    
    const user = await UserRepository.getUserByUsername(username)
    if (!user) {
      throw new ValidationError(ErrorCodes.USER_NOT_FOUND)
    }

    // Compare passwords using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new ValidationError(ErrorCodes.INVALID_CREDENTIALS)
    }

    // Generate JWT token
    const token = JwtService.generateToken({ userId: user._id, username: user.username })

    Logger.log(LogLevel.INFO, `User logged in: ${user.username}`)
    return { token }
  }
}

export default UserService
