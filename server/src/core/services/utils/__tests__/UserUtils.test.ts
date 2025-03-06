import UserUtils from '../UserUtils'
import ValidationError from '../../../errors/ValidationError'

describe('UserUtils', () => {
  describe('sanitizeUserData', () => {
    it('should trim all string fields in the user object', () => {
      const userData = {
        email: '  test@example.com  ',
        password: '  StrongPass123!  ',
        firstName: '  John  ',
        lastName: '  Doe  ',
        username: '  johndoe  '
      }

      // @ts-ignore
      const sanitized = UserUtils.sanitizeUserData(userData)

      expect(sanitized.email).toBe('test@example.com')
      expect(sanitized.password).toBe('StrongPass123!')
      expect(sanitized.firstName).toBe('John')
      expect(sanitized.lastName).toBe('Doe')
      expect(sanitized.username).toBe('johndoe')
    })
  })

  describe('validateRequiredFieldsOrThrowError', () => {
    it('should throw ValidationError if required fields are missing', () => {
      const userData = {
        email: 'test@example.com',
        firstName: 'John'
        // Missing lastName, password, username
      }

      expect(() =>
        // @ts-ignore
        UserUtils.validateRequiredFieldsOrThrowError(userData, ['email', 'firstName', 'lastName', 'password'])
      ).toThrow(ValidationError)
    })

    it('should not throw an error if all required fields are present', () => {
      const userData = {
        email: 'test@example.com',
        password: 'StrongPass123!',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe'
      }

      expect(() =>
        // @ts-ignore
        UserUtils.validateRequiredFieldsOrThrowError(userData, [
          'email',
          'password',
          'firstName',
          'lastName',
          'username'
        ])
      ).not.toThrow()
    })
  })

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(UserUtils.isValidEmail('test@example.com')).toBe(true)
      expect(UserUtils.isValidEmail('user.name@domain.co')).toBe(true)
    })

    it('should return false for invalid emails', () => {
      expect(UserUtils.isValidEmail('invalid-email')).toBe(false)
      expect(UserUtils.isValidEmail('user@com')).toBe(false)
      expect(UserUtils.isValidEmail('user@.com')).toBe(false)
      expect(UserUtils.isValidEmail('@example.com')).toBe(false)
    })
  })

  describe('isStrongPassword', () => {
    it('should return true for strong passwords', () => {
      expect(UserUtils.isStrongPassword('StrongPass123!')).toBe(true)
      expect(UserUtils.isStrongPassword('Aa1@aaaa')).toBe(true)
    })

    it('should return false for weak passwords', () => {
      expect(UserUtils.isStrongPassword('weakpass')).toBe(false) // No uppercase, number, or special char
      expect(UserUtils.isStrongPassword('Weakpass')).toBe(false) // No number, no special char
      expect(UserUtils.isStrongPassword('Weak123')).toBe(false) // No special char
      expect(UserUtils.isStrongPassword('12345678')).toBe(false) // Only numbers
    })
  })
})
