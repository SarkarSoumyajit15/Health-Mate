
import { RateLimiterRedis } from "rate-limiter-flexible";
import redis from "../utils/redis.js";

export const normalLimiter = new RateLimiterRedis({
    storeClient: redis, // Use Redis as the storage
    keyPrefix: "rate-limit-normal",  // Prefix for Redis keys
    points: 100,  // Max requests per window
    duration: 15 * 60, // 15 minutes window (900 seconds)
    blockDuration: 60, // Block for 1 minute if exceeded
    inmemoryBlockOnConsumedExceed: 10, // If 10 requests per window, block inmemory for 10 seconds

});


export const signinLimiter = new RateLimiterRedis({
    storeClient: redis, // Use Redis as the storage
    keyPrefix: "rate-limit-signin",  // Prefix for Redis keys
    points: 10,  // Max requests per window
    duration: 15 * 60, // 15 minutes window (900 seconds)
    blockDuration: 120, // Block for 2 minute if exceeded
    inmemoryBlockOnConsumedExceed: 10, // If 10 requests per window, block inmemory for 10 seconds

});




const rateLimiterMiddleware =(limiter)=> async (req, res, next) => {
    try {
      const limiterRes = await limiter.consume(req.ip); // Consume 1 request point
      res.set({
        "X-RateLimit-Limit": limiter.points, // Total allowed requests
        "X-RateLimit-Remaining": limiterRes.remainingPoints, // Remaining requests
        "X-RateLimit-Reset": Math.ceil((limiterRes.msBeforeNext || 0) / 1000), // Time to reset
      });
      next(); // Allow request to proceed
    } catch (err) {
      res.status(429).json({
        error: "Too many requests, please try again later.",
      });
    }
};

export default rateLimiterMiddleware;
