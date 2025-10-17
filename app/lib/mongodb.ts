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
  const start = Date.now();

  if (!MONGODB_URI) {
    const msg = 'MONGODB_URI is not defined. Set it in your environment (.env.local or platform env).';
    logger.error({ msg }, 'MongoDB configuration error');
    throw new Error(msg);
  }

  // Return cached connection if available
  if (cached.conn) {
    logger.debug({ ms: Date.now() - start }, 'Using cached MongoDB connection');
    return cached.conn;
  }

  // If a connection is already being established, await it
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      dbName: DB_NAME,
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      keepAlive: true,
    };

    // Retry with exponential backoff (3 attempts)
    const attemptConnect = async (attempt = 1): Promise<typeof mongoose> => {
      try {
        logger.info({ dbName: DB_NAME, attempt }, 'Connecting to MongoDB...');
        const m = await mongoose.connect(MONGODB_URI!, opts);

        // Wire connection events once
        const conn = m.connection;
        conn.on('connected', () => logger.info({ name: conn.name }, 'MongoDB connected'));
        conn.on('disconnected', () => logger.warn({ name: conn.name }, 'MongoDB disconnected'));
        conn.on('error', (err) => logger.error({ err: String(err) }, 'MongoDB connection error'));

        logger.info(
          {
            host: conn.host,
            name: conn.name,
            readyState: conn.readyState,
            ms: Date.now() - start,
          },
          'MongoDB connected successfully'
        );
        return m;
      } catch (error) {
        logger.warn({ attempt, error: (error as Error).message }, 'MongoDB connect attempt failed');
        if (attempt >= 3) throw error;
        const delay = 500 * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, delay));
        return attemptConnect(attempt + 1);
      }
    };

    cached.promise = attemptConnect();
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
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

/**
 * Helper: Is DB Connected
 */
export function isDbConnected(): boolean {
  return getConnectionState() === 1;
}

// Export default connection function
export default connectDB;
