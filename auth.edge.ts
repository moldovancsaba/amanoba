/**
 * NextAuth Edge Runtime Configuration
 * 
 * What: Edge-compatible authentication for middleware
 * Why: Middleware runs in Edge Runtime and cannot import Mongoose/MongoDB
 * 
 * CRITICAL: Uses authConfigEdge instead of authConfig to avoid MongoDB imports
 */

import NextAuth from 'next-auth';
import { authConfigEdge } from './auth.config.edge';

/**
 * Edge-Compatible NextAuth Instance
 * 
 * Why: For use in middleware without database dependencies
 * Uses authConfigEdge which has NO MongoDB dependencies
 */
export const { auth: authEdge } = NextAuth(authConfigEdge);
