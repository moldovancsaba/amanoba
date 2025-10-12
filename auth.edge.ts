/**
 * NextAuth Edge Runtime Configuration
 * 
 * What: Edge-compatible authentication for middleware
 * Why: Middleware runs in Edge Runtime and cannot import Mongoose/MongoDB
 */

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

/**
 * Edge-Compatible NextAuth Instance
 * 
 * Why: For use in middleware without database dependencies
 */
export const { auth: authEdge } = NextAuth(authConfig);
