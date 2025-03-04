import express, { Express } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import initOpenApi from './services/openapi/OpenApiService'
import Logger from './services/logger'
import { LogLevel } from './core/enums'

// Load environment variables from .env file
dotenv.config()

// Initialize Express app
const app: Express = express()
app.use(express.json())
app.use(cors())
app.use(helmet())
const middlewares = []

// Initialize OpenAPI Service (loads routes dynamically)
async function startServer() {
  try {
    middlewares.forEach((m) => app.use(m))
    await initOpenApi(app)

    const PORT = process.env.PORT || 4000
    app.listen(PORT, () => {
      Logger.log(LogLevel.INFO, `🚀 Server is running on http://localhost:${PORT}/api/v1`)
    })
  } catch (error) {
    Logger.log(LogLevel.ERROR, 'Failed to start server', 'ERR_SERVER_START', 500)
    process.exit(1)
  }
}

startServer()
