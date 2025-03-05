import { Request, Response, NextFunction } from 'express'
import { HttpStatus, LogLevel } from '../../core/enums'
import Logger from '../../services/logger'

class AuthMiddlewareService {
  /**
   * Middleware to simulate user authentication with a hardcoded user.
   */
  public static async isAuthenticated(req: Express.ExpressRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        Logger.log(LogLevel.WARN, 'Unauthorized: No token provided', 'ERR_401', HttpStatus.UNAUTHORIZED)
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized: No token provided' })
      }

      const token = authHeader.split(' ')[1]

      if (token !== 'test-token') {
        Logger.log(LogLevel.WARN, 'Unauthorized: Invalid token', 'ERR_401', HttpStatus.UNAUTHORIZED)
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized: Invalid token' })
      }

      // ✅ Attaching user data to req for further processing
      req.user = {
        _id: '12345',
        username: 'testuser',
        password: 'test',
        fullName: 'test test',
        email: 'test@test.com'
      }

      Logger.log(LogLevel.INFO, `User authenticated: ${req.user.username}`)

      // Proceed to the next middleware or route handler
      next()
    } catch (error) {
      Logger.log(LogLevel.ERROR, 'Authentication failed', 'ERR_500', HttpStatus.INTERNAL_ERROR)
      return res.status(HttpStatus.INTERNAL_ERROR).json({ message: 'Authentication failed' })
    }
  }
}

export default AuthMiddlewareService
