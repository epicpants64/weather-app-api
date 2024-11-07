import rateLimit from 'express-rate-limit'
import redis from 'redis'
import { RedisStore } from 'rate-limit-redis'

export const configureRateLimiter = async ({ host, port }) => {
  const redisClient = redis.createClient({
    url: `redis://${host}:${port}`
  })
  await redisClient.connect()

  return rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 100, // limit each IP address to 100 requests per time frame set in windowMs
    message: 'Too many requests, please try again later.',
    store: new RedisStore({
      client: redisClient,
      expiry: 60, // this is in seconds
      sendCommand: (...args) => redisClient.sendCommand(args)
    }),
    keyGenerator: (req) => req.ip // Use IP address as identifier
  })
}
