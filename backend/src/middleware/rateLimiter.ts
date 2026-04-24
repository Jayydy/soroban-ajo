import rateLimit, { Options } from 'express-rate-limit'
import { Request, Response } from 'express'
import { logger } from '../utils/logger'

const getEnvNum = (key: string, fallback: number) =>
  process.env[key] ? parseInt(process.env[key] as string, 10) : fallback

/**
 * Builds a rate limiter with consistent defaults and logging on limit hit.
 */
function buildLimiter(overrides: Partial<Options>) {
  return rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request) => req.path === '/health',
    handler: (req: Request, res: Response) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.path,
        method: req.method,
        limit: (overrides as any).max,
      })
      res.status(429).json({
        success: false,
        error: 'Too many requests, please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
      })
    },
    ...overrides,
  })
}

/**
 * General API rate limiter — applied globally to /api/*
 * Default: 100 req / 15 min per IP
 */
export const apiLimiter = buildLimiter({
  windowMs: getEnvNum('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
  max: getEnvNum('RATE_LIMIT_MAX_REQUESTS', 100),
})

/**
 * Strict limiter for sensitive routes (auth, webhooks)
 * Default: 10 req / 1 hour per IP
 */
export const strictLimiter = buildLimiter({
  windowMs: getEnvNum('STRICT_LIMIT_WINDOW_MS', 60 * 60 * 1000),
  max: getEnvNum('STRICT_LIMIT_MAX_REQUESTS', 10),
  handler: (req: Request, res: Response) => {
    logger.warn('Strict rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
    })
    res.status(429).json({
      success: false,
      error: 'Too many attempts from this IP, please try again after an hour.',
      code: 'RATE_LIMIT_EXCEEDED',
    })
  },
})

/**
 * Groups write limiter — create/join/contribute
 * Default: 30 req / 15 min per IP
 */
export const groupsWriteLimiter = buildLimiter({
  windowMs: getEnvNum('GROUPS_WRITE_WINDOW_MS', 15 * 60 * 1000),
  max: getEnvNum('GROUPS_WRITE_MAX_REQUESTS', 30),
})

/**
 * Analytics limiter — read-heavy but still bounded
 * Default: 60 req / 15 min per IP
 */
export const analyticsLimiter = buildLimiter({
  windowMs: getEnvNum('ANALYTICS_LIMIT_WINDOW_MS', 15 * 60 * 1000),
  max: getEnvNum('ANALYTICS_LIMIT_MAX_REQUESTS', 60),
})

/**
 * Public read limiter — list/get endpoints
 * Default: 200 req / 15 min per IP
 */
export const publicReadLimiter = buildLimiter({
  windowMs: getEnvNum('PUBLIC_READ_WINDOW_MS', 15 * 60 * 1000),
  max: getEnvNum('PUBLIC_READ_MAX_REQUESTS', 200),
})
