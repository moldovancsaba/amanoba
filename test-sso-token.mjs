/**
 * Test SSO Token to see what claims are included
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

console.log('SSO Configuration:');
console.log('SSO_SCOPES:', process.env.SSO_SCOPES);
console.log('SSO_CLIENT_ID:', process.env.SSO_CLIENT_ID?.substring(0, 20) + '...');
console.log('\nTo test:');
console.log('1. Login via SSO');
console.log('2. Check server logs for ID token claims');
console.log('3. The ID token should include "role" if "roles" scope is requested');
