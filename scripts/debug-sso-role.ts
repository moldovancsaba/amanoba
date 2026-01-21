/**
 * Debug SSO Role Extraction
 * 
 * What: Script to debug SSO role extraction and verify admin role is being extracted correctly
 * Why: Help diagnose why admin users can't access admin routes
 * 
 * Usage: npx tsx scripts/debug-sso-role.ts
 */

import { extractSSOUserInfo, validateSSOToken } from '../app/lib/auth/sso';
import { logger } from '../app/lib/logger';

// Example token (replace with actual token from SSO)
const testToken = process.env.SSO_TEST_TOKEN || '';

if (!testToken) {
  console.error('❌ SSO_TEST_TOKEN environment variable not set');
  console.log('\nTo use this script:');
  console.log('1. Get an ID token from SSO (from browser dev tools or SSO callback)');
  console.log('2. Set SSO_TEST_TOKEN environment variable');
  console.log('3. Run: SSO_TEST_TOKEN="your-token" npx tsx scripts/debug-sso-role.ts');
  process.exit(1);
}

async function debugSSORole() {
  console.log('🔍 Debugging SSO Role Extraction...\n');

  try {
    // Validate token
    console.log('1. Validating SSO token...');
    const claims = await validateSSOToken(testToken);
    
    if (!claims) {
      console.error('❌ Token validation failed');
      process.exit(1);
    }
    
    console.log('✅ Token validated successfully\n');
    
    // Show all claims
    console.log('2. All token claims:');
    console.log(JSON.stringify(claims, null, 2));
    console.log('\n');
    
    // Check for role-related claims
    console.log('3. Role-related claims:');
    const roleClaims = {
      role: claims.role,
      roles: claims.roles,
      user_role: (claims as any).user_role,
      groups: (claims as any).groups,
      permissions: (claims as any).permissions,
      authorities: (claims as any).authorities,
      realm_access: (claims as any).realm_access,
      resource_access: (claims as any).resource_access,
      'https://sso.doneisbetter.com/roles': (claims as any)['https://sso.doneisbetter.com/roles'],
      'https://sso.doneisbetter.com/groups': (claims as any)['https://sso.doneisbetter.com/groups'],
      custom_roles: (claims as any).custom_roles,
      app_roles: (claims as any).app_roles,
      wids: (claims as any).wids,
      organization_roles: (claims as any).organization_roles,
      role_assignments: (claims as any).role_assignments,
    };
    
    console.log(JSON.stringify(roleClaims, null, 2));
    console.log('\n');
    
    // Extract user info
    console.log('4. Extracting user info...');
    const userInfo = extractSSOUserInfo(claims);
    
    console.log('✅ Extracted user info:');
    console.log(JSON.stringify(userInfo, null, 2));
    console.log('\n');
    
    // Final verdict
    console.log('5. Result:');
    if (userInfo.role === 'admin') {
      console.log('✅ Admin role detected!');
      console.log(`   - Sub: ${userInfo.sub}`);
      console.log(`   - Email: ${userInfo.email || 'N/A'}`);
      console.log(`   - Name: ${userInfo.name || 'N/A'}`);
      console.log(`   - Role: ${userInfo.role}`);
    } else {
      console.log('❌ Admin role NOT detected');
      console.log(`   - Extracted role: ${userInfo.role}`);
      console.log('\n💡 Tips:');
      console.log('   - Check if SSO provider uses a different claim name for roles');
      console.log('   - Verify the role value in SSO matches "admin" (case-insensitive)');
      console.log('   - Check if role is in UserInfo endpoint instead of ID token');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

debugSSORole();
