import { isEmpty, trim, mapValues } from 'lodash'
import ValidationError from '../../errors/ValidationError'
import ErrorCodes from '../../errors/errorCodes'

class UserUtils {
  /**
   * Cleans up user input by trimming all string fields.
   */
  static sanitizeUserData(userData: User): User {
    return mapValues(userData, (value) => (typeof value === 'string' ? trim(value) : value))
  }

  /**
   * Validates required fields in user data.
   */
  static validateRequiredFieldsOrThrowError(userData: User, requiredFields: string[]): void {
    const missingFields = requiredFields.filter((field) => isEmpty(userData[field]))

    if (missingFields.length > 0) {
      throw new ValidationError({
        ...ErrorCodes.GENERIC_ERROR,
        userMessage: `Missing required fields: ${missingFields.join(', ')}`
      })
    }
  }

  /**
   * Returns `true` if the email is valid, `false` otherwise.
   */
  static isValidEmail(email: string): boolean {
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  /**
   * Ensures a password is strong.
   */
  static isStrongPassword(password: string): boolean {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return strongPasswordRegex.test(password)
  }
}

export default UserUtils
