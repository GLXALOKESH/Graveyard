import { Redis } from "ioredis";

export const redisClient = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  retryStrategy: (times: number) => {
    return Math.min(times * 50, 2000);
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});