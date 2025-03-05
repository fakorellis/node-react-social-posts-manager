import mongoose, { Connection } from 'mongoose'
import Logger from '../logger'
import { LogLevel } from '../../core/enums'

/**
 * Service to handle MongoDB connection and database operations.
 */
class MongoDBService {
  private static connection: Connection | null = null

  /**
   * Returns the current MongoDB connection instance if it exists.
   * If no connection exists, it returns `null`.
   */
  static getInstance(): Connection | null {
    return MongoDBService.connection
  }

  /**
   * Connects to MongoDB using Mongoose and stores the connection.
   * If a connection already exists, it returns the existing connection.
   */
  static async connect(): Promise<Connection> {
    if (MongoDBService.connection) {
      Logger.log(LogLevel.INFO, '⚠️ MongoDB connection already established.')
      return MongoDBService.connection
    }

    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/social-posts-manager'

    try {
      const mongooseInstance = await mongoose.connect(mongoUri)
      MongoDBService.connection = mongooseInstance.connection

      Logger.log(LogLevel.INFO, '✅ MongoDB connected successfully')
      return MongoDBService.connection
    } catch (error) {
      Logger.log(LogLevel.ERROR, '❌ MongoDB connection failed', 'ERR_MONGO_CONNECTION', 500)
      process.exit(1) // Exit if connection fails
    }
  }

  /**
   * Disconnects from MongoDB.
   */
  static async disconnect(): Promise<void> {
    if (!MongoDBService.connection) {
      Logger.log(LogLevel.WARN, '⚠️ No active MongoDB connection to disconnect.')
      return
    }

    try {
      await mongoose.disconnect()
      MongoDBService.connection = null
      Logger.log(LogLevel.INFO, '✅ MongoDB disconnected successfully')
    } catch (error) {
      Logger.log(LogLevel.ERROR, '❌ MongoDB disconnection failed', 'ERR_MONGO_DISCONNECT', 500)
    }
  }

  /**
   * Checks the database connection status.
   * @returns A string representing the current status.
   */
  static getStatus(): string {
    if (!MongoDBService.connection) return 'No Connection'

    const state = MongoDBService.connection.readyState
    switch (state) {
      case 0:
        return 'Disconnected'
      case 1:
        return 'Connected'
      case 2:
        return 'Connecting'
      case 3:
        return 'Disconnecting'
      default:
        return 'Unknown'
    }
  }
}

export default MongoDBService
