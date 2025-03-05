import jwt, { Secret, SignOptions } from 'jsonwebtoken'

class JwtService {
  private static secretKey: Secret = process.env.JWT_SECRET || 'default_secret'
  private static expiresIn = '2 days'

  /**
   * Generates a JWT token for a given payload.
   */
  static generateToken(payload: Record<string, any>): string {
    // @ts-ignore
    const options: SignOptions = { expiresIn: JwtService.expiresIn }
    return jwt.sign(payload, JwtService.secretKey, options)
  }

  /**
   * Verifies a JWT token and returns the decoded payload.
   */
  static verifyToken(token: string): Record<string, any> | null {
    try {
      return jwt.verify(token, JwtService.secretKey) as Record<string, any>
    } catch (error) {
      // Invalid or expired token
      return null
    }
  }
}

export default JwtService
