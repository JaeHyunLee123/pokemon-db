import { RateLimiterMemory } from "rate-limiter-flexible";

export const loginRateLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 60, // per 60 seconds by IP
});

export const signUpRateLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 60, // per 60 seconds by IP
});

export const searchAiRateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 60, // per 60 seconds by IP or Session
});
