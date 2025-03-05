import { FilterQuery } from 'mongoose'
import UserModel from '../models/UserModel'
import { LogLevel } from '../../core/enums'
import Logger from '../../services/logger'

class UserRepository {
  /**
   * Create a new user
   * @param userData - Object containing user details
   * @returns The created user document
   */
  static async createUser(userData: User): Promise<User> {
    try {
      const user = await UserModel.create(userData)
      Logger.log(LogLevel.INFO, `User created: ${user.username}`)
      return user.toObject()
    } catch (error) {
      Logger.log(LogLevel.ERROR, `❌ Error creating user: ${error.message}`, 'ERR_CREATE_USER', 500)
      throw error
    }
  }

  /**
   * Find a user by ID
   * @param userId - The ID of the user
   * @returns The user document or null
   */
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const user = <User>await UserModel.findById(userId).lean()
      return user
    } catch (error) {
      Logger.log(LogLevel.ERROR, `❌ Error finding user by ID: ${error.message}`, 'ERR_FIND_USER', 500)
      throw error
    }
  }

  /**
   * Find a user by username
   * @param username - The username of the user
   * @returns The user document or null
   */
  static async getUserByUsername(username: string): Promise<User | null> {
    try {
      const user = <User>await UserModel.findOne({ username }).lean()
      return user
    } catch (error) {
      Logger.log(LogLevel.ERROR, `❌ Error finding user by username: ${error.message}`, 'ERR_FIND_USER', 500)
      throw error
    }
  }

  /**
   * Update a user by ID
   * @param userId - The ID of the user
   * @param updateData - Object containing updated fields
   * @returns The updated user document
   */
  static async updateUserById(userId: string, updateData: Partial<User>): Promise<User | null> {
    try {
      const updatedUser = <User>await UserModel.findByIdAndUpdate(userId, updateData, { new: true }).lean()
      if (updatedUser) {
        Logger.log(LogLevel.INFO, `User updated: ${updatedUser.username}`)
      }
      return updatedUser
    } catch (error) {
      Logger.log(LogLevel.ERROR, `❌ Error updating user: ${error.message}`, 'ERR_UPDATE_USER', 500)
      throw error
    }
  }

  /**
   * Delete a user by ID
   * @param userId - The ID of the user
   * @returns The deleted user document
   */
  static async deleteUserById(userId: string): Promise<User | null> {
    try {
      const deletedUser = <User>await UserModel.findByIdAndDelete(userId).lean()
      if (deletedUser) {
        Logger.log(LogLevel.INFO, `User deleted: ${deletedUser.username}`)
      }
      return deletedUser
    } catch (error) {
      Logger.log(LogLevel.ERROR, `❌ Error deleting user: ${error.message}`, 'ERR_DELETE_USER', 500)
      throw error
    }
  }

  /**
   * Find users based on flexible criteria
   */
  static async findByCriteria(criteria: FilterQuery<User>, limit = 10, skip = 0): Promise<User[]> {
    try {
      const users = await UserModel.find(criteria).limit(limit).skip(skip).lean()

      Logger.log(LogLevel.INFO, `✅ Found ${users.length} user(s) matching criteria.`)
      return users as User[]
    } catch (error) {
      Logger.log(LogLevel.ERROR, `❌ Error finding users by criteria: ${error.message}`, 'ERR_FIND_USERS', 500)
      throw error
    }
  }
}

export default UserRepository
