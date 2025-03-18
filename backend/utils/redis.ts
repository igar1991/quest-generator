import Redis from "ioredis";

/**
 * Redis client instance for connecting to Redis
 */
const redisClient = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379",
);

/**
 * Connect to Redis and handle connection events
 * @returns Promise that resolves when Redis is connected
 */
export async function connectToRedis(): Promise<void> {
  return new Promise((resolve, reject) => {
    redisClient.on("connect", () => {
      console.log("Connected to Redis");
      resolve();
    });

    redisClient.on("error", (error) => {
      console.error("Redis connection error:", error);
      reject(error);
    });
  });
}

/**
 * Get the Redis client instance
 * @returns Redis client instance
 */
export function getRedisClient(): Redis {
  return redisClient;
}

/**
 * Close the Redis connection
 */
export async function closeRedisConnection(): Promise<void> {
  await redisClient.quit();
  console.log("Redis connection closed");
}
