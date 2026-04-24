import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { initSentry, Sentry } from './config/sentry'
import { initDatadog } from './config/datadog'
import { errorHandler } from './middleware/errorHandler'
import { requestLogger } from './middleware/requestLogger'
// import { setupSwagger } from './middleware/swagger'
import { logger } from './utils/logger'
import { groupsRouter } from './routes/groups'
import { healthRouter } from './routes/health'
import { webhooksRouter } from './routes/webhooks'
import { authRouter } from './routes/auth'
import { analyticsRouter } from './routes/analytics'
import { emailRouter } from './routes/email'
import { jobsRouter } from './routes/jobs'
import { setupSwagger } from './swagger'
import {
  apiLimiter,
  strictLimiter,
  groupsWriteLimiter,
  analyticsLimiter,
  publicReadLimiter,
} from './middleware/rateLimiter'
import { ddosProtection, ipBlocklist } from './middleware/ddosProtection'
import { requestThrottle } from './middleware/requestThrottle'
import { performanceMiddleware } from './middleware/performance'
import { metricsRouter } from './routes/metrics'
import { startWorkers, stopWorkers } from './jobs/jobWorkers'
import { startScheduler, stopScheduler } from './cron/scheduler'

dotenv.config()

// Init Sentry before anything else
initSentry()
// Init DataDog APM (no-op if DD_API_KEY not set)
initDatadog()

const app = express()
const PORT = process.env.PORT || 3001
// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.set('trust proxy', 1)

// DDoS & IP protection — run before everything else
app.use(ipBlocklist)
app.use(ddosProtection)
app.use(requestThrottle)

app.use(requestLogger)
app.use(performanceMiddleware)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Global API rate limit
app.use('/api', apiLimiter)

// API Documentation
setupSwagger(app)

// Routes
app.use('/health', healthRouter)
app.use('/api/auth', strictLimiter, authRouter)
app.use('/api/groups', publicReadLimiter, groupsRouter)
app.use('/api/webhooks', strictLimiter, webhooksRouter)
app.use('/api/analytics', analyticsLimiter, analyticsRouter)
app.use('/api/email', emailRouter)
app.use('/api/jobs', strictLimiter, jobsRouter)
app.use('/api/metrics', metricsRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found'
  })
})

// Sentry error handler (must be before custom error handler)
app.use(Sentry.expressErrorHandler())

// Error handling
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`, { env: process.env.NODE_ENV || 'development' })

  // Start background job workers and cron scheduler
  try {
    startWorkers()
    startScheduler()
    logger.info('Background jobs and cron scheduler started')
  } catch (err) {
    logger.error('Failed to start background jobs', {
      error: err instanceof Error ? err.message : String(err),
    })
  }
})

// Graceful shutdown
const shutdown = async () => {
  logger.info('Shutting down gracefully...')
  stopScheduler()
  await stopWorkers()
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

export default app

