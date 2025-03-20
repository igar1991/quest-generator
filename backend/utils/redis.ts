import Redis from "ioredis";

// Track connection state
let redisClient: Redis | null = null;
let isConnecting = false;
let connectionPromise: Promise<void> | null = null;

/**
 * Connect to Redis and handle connection events
 * @returns Promise that resolves when Redis is connected
 */
async function connectToRedis(): Promise<void> {
  // If already connecting, return the existing promise
  if (isConnecting && connectionPromise) {
    return connectionPromise;
  }

  // If already connected, return resolved promise
  if (redisClient && redisClient.status === "ready") {
    return Promise.resolve();
  }

  // Set connecting state
  isConnecting = true;

  // Create connection promise
  connectionPromise = new Promise<void>((resolve, reject) => {
    console.log("Creating new Redis connection");

    // Create new client with timeout
    redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      connectTimeout: 10000, // 10 seconds
      retryStrategy: (times) => {
        if (times > 3) {
          console.error(`Redis connection failed after ${times} attempts`);
          return null; // Stop retrying
        }
        const delay = Math.min(times * 1000, 3000);
        console.log(`Retrying Redis connection in ${delay}ms`);
        return delay;
      },
    });

    // Handle connection events
    redisClient.once("connect", () => {
      console.log("Connected to Redis");
      isConnecting = false;
      resolve();
    });

    redisClient.once("error", (error) => {
      console.error("Redis connection error:", error);
      isConnecting = false;
      redisClient = null;
      reject(error);
    });

    // Add timeout
    const timeout = setTimeout(() => {
      if (isConnecting) {
        console.error("Redis connection timeout");
        isConnecting = false;
        if (redisClient) {
          redisClient.disconnect();
        }
        redisClient = null;
        reject(new Error("Redis connection timeout"));
      }
    }, 15000);

    // Clear timeout on success or error
    redisClient.once("connect", () => clearTimeout(timeout));
    redisClient.once("error", () => clearTimeout(timeout));
  });

  return connectionPromise;
}

/**
 * Get the Redis client instance, automatically connecting if needed
 * @returns Redis client instance
 */
async function getRedisClient(): Promise<Redis> {
  if (!redisClient || redisClient.status !== "ready") {
    await connectToRedis();
  }

  if (!redisClient) {
    throw new Error("Failed to establish Redis connection");
  }

  return redisClient;
}

/**
 * Close the Redis connection
 */
async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    isConnecting = false;
    connectionPromise = null;
    console.log("Redis connection closed");
  }
}

export { connectToRedis, getRedisClient, closeRedisConnection };
