const Redis = require("ioredis");

// Track connection state
let redisClient = null;
let isConnecting = false;
let connectionPromise = null;

/**
 * Connect to Redis and handle connection events
 * @returns Promise that resolves when Redis is connected
 */
async function connectToRedis() {
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
  connectionPromise = new Promise((resolve, reject) => {
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
        redisClient.disconnect();
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
 * Get the Redis client instance
 * @returns Redis client instance
 * @throws Error if Redis is not connected
 */
function getRedisClient() {
  if (!redisClient || redisClient.status !== "ready") {
    throw new Error("Redis client not connected. Call connectToRedis() first.");
  }
  return redisClient;
}

/**
 * Close the Redis connection
 */
async function closeRedisConnection() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    isConnecting = false;
    connectionPromise = null;
    console.log("Redis connection closed");
  }
}

module.exports = {
  connectToRedis,
  getRedisClient,
  closeRedisConnection,
};
