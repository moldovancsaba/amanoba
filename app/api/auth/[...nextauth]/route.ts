/**
 * NextAuth API Route Handler
 * 
 * What: Catch-all route for NextAuth authentication endpoints
 * Why: Handles sign in, sign out, callbacks, and session management
 */

import { handlers } from '@/auth';

export const { GET, POST } = handlers;
