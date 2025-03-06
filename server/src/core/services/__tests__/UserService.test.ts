import UserService from "../UserService";
import UserRepository from "../../repositories/UserRepository";
import ValidationError from "../../errors/ValidationError";
import ErrorCodes from "../../errors/errorCodes";

jest.mock('../../repositories/UserRepository')

describe('UserService.registerUser', () => {
    it('should register a user successfully', async () => {
      const mockUser: User = {
        email: 'test@example.com',
        password: 'StrongPass123!',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        fullName: 'John Doe'
      }
  
      jest.spyOn(UserRepository, 'getUserByUsername').mockResolvedValue(null)
      jest.spyOn(UserRepository, 'findByCriteria').mockResolvedValue([])
      jest.spyOn(UserRepository, 'createUser').mockResolvedValue(mockUser)
  
      const result = await UserService.registerUser(mockUser)
  
      expect(result).toMatchObject(mockUser)
    })
  
    it('should throw ValidationError if username is taken', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'StrongPass123!',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        fullName: 'John Doe'
      }
  
      jest.spyOn(UserRepository, 'getUserByUsername').mockResolvedValue(mockUser)
  
      await expect(UserService.registerUser(mockUser)).rejects.toThrow(ValidationError)
      await expect(UserService.registerUser(mockUser)).rejects.toThrow(ErrorCodes.USERNAME_TAKEN.userMessage)
    })
  })

