import { Request, Response, NextFunction } from 'express'
import { HttpStatus, LogLevel } from '../../core/enums'
import Logger from '../../services/logger'
import UserRepository from '../../core/repositories/UserRepository'
import JwtService from '../../services/jwt/JwtService'

class AuthMiddlewareService {
  /**
   * Middleware to verify JWT authentication, fetch user data, and attach it to the request.
   */
  static async isAuthenticated(req: Express.ExpressRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      Logger.log(LogLevel.WARN, 'Unauthorized: No token provided', 'ERR_401', HttpStatus.UNAUTHORIZED)
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized: No token provided' })
    }

    const token = authHeader.split(' ')[1]
    const decodedToken = JwtService.verifyToken(token)

    if (!decodedToken || !decodedToken.userId) {
      Logger.log(LogLevel.WARN, 'Unauthorized: Invalid token', 'ERR_401', HttpStatus.UNAUTHORIZED)
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized: Invalid token' })
    }

    // Fetch user from database using userId
    const user = await UserRepository.getUserById(decodedToken.userId)
    if (!user) {
      Logger.log(LogLevel.WARN, 'Unauthorized: User not found', 'ERR_401', HttpStatus.UNAUTHORIZED)
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized: User not found' })
    }

    // Attach user to request
    req.user = user

    Logger.log(LogLevel.INFO, `User authenticated: ${req.user.username}`)

    // Proceed to the next middleware or route handler
    next()
  }
}

export default AuthMiddlewareService
