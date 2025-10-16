/**
 * MongoDB Connection Singleton
 * 
 * Why: Next.js App Router hot-reloads during development, causing multiple connection attempts.
 * This singleton pattern with global caching prevents "MongoClient already connected" errors.
 * 
 * What: Provides cached Mongoose connection that persists across hot-reloads in development
 * and efficiently manages connections in production.
 */

import mongoose from 'mongoose';
import { logger } from './logger';

// MongoDB URI from environment variables
// Why: Centralized configuration via environment variables, not hardcoded
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'amanoba';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global cache for Mongoose connection
 * 
 * Why: In development, Next.js clears the module cache on hot-reload,
 * but global variables persist. This prevents creating multiple connections.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Initialize cached connection
// Why: On first import, ensure cache exists
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connect to MongoDB with Mongoose
 * 
 * What: Returns cached connection if available, otherwise creates new one
 * Why: Prevents connection exhaustion and ensures single connection per process
 * 
 * @returns Promise resolving to Mongoose instance
 */
async function connectDB(): Promise<typeof mongoose> {
  // Return cached connection if available
  // Why: Reuse existing connection to avoid overhead
  if (cached.conn) {
    logger.debug('Using cached MongoDB connection');
    return cached.conn;
  }

  // If no cached connection but connection attempt in progress, await it
  // Why: Prevent multiple simultaneous connection attempts
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      dbName: DB_NAME,
      bufferCommands: false, // Disable buffering for faster failure
      maxPoolSize: 10, // Maximum 10 concurrent connections in pool
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if no server available
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    logger.info({ dbName: DB_NAME }, 'Connecting to MongoDB...');

    // Create new connection promise
    // Why: Store promise globally so multiple imports don't create multiple connections
    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        logger.info(
          {
            host: mongoose.connection.host,
            name: mongoose.connection.name,
            readyState: mongoose.connection.readyState,
          },
          'MongoDB connected successfully'
        );
        return mongoose;
      })
      .catch((error) => {
        logger.error({ error: error.message }, 'MongoDB connection failed');
        throw error;
      });
  }

  try {
    // Await connection and cache it
    // Why: Once connected, cache for future requests
    cached.conn = await cached.promise;
  } catch (error) {
    // If connection fails, clear promise so next call can retry
    // Why: Don't permanently cache failures
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

/**
 * Disconnect from MongoDB
 * 
 * What: Gracefully closes MongoDB connection
 * Why: Used during server shutdown or test cleanup
 */
export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    logger.info('Disconnecting from MongoDB...');
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    logger.info('MongoDB disconnected');
  }
}

/**
 * Check MongoDB connection status
 * 
 * What: Returns current connection state
 * Why: Used for health checks and debugging
 * 
 * States:
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 */
export function getConnectionState(): number {
  return mongoose.connection.readyState;
}

// Export default connection function
export default connectDB;
