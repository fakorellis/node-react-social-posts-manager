import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongoServer: MongoMemoryServer

/**
 * Sets up an in-memory MongoDB instance before running tests.
 */
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()

  await mongoose.connect(mongoUri)
})

/**
 * Clears the test database after each test case.
 */
afterEach(async () => {
  await mongoose.connection.db.dropDatabase()
})

/**
 * Closes the database and stops the server after all tests.
 */
afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})
