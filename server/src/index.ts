import express, { Express } from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import { CacheService } from './services/cache/CacheService'
import OpenApiService from './services/openapi/OpenApiService'
import MongoDBService from './services/mongodb/MongoDBService'
import PostService from './core/services/PostService'
import Logger from './services/logger'
import { LogLevel } from './core/enums'

// Load environment variables from .env file
dotenv.config()

// Initialize Express app
const app: Express = express()
app.use(express.json())
app.use(cors())
app.use(helmet())
const middlewares = [bodyParser.json({ limit: '50mb' })]

// Initialize OpenAPI Service (loads routes dynamically)
async function startServer() {
  try {
    middlewares.forEach((m) => app.use(m))
    await MongoDBService.connect()
    await PostService.fetchPostsFromApi()
    OpenApiService.setupRoutes(app)
    OpenApiService.setupSwaggerDocs(app)
    CacheService.initCache()

    const PORT = process.env.PORT || 4000
    app.listen(PORT, () => {
      Logger.log(LogLevel.INFO, `🚀 Server is running on http://localhost:${PORT}/api/v1`)
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      Logger.log(LogLevel.INFO, '🛑 Gracefully shutting down...')
      await MongoDBService.disconnect()
      process.exit(0)
    })
  } catch (error) {
    Logger.log(LogLevel.ERROR, '❌ Failed to start server', 'ERR_SERVER_START', 500)
    process.exit(1)
  }
}

startServer()
