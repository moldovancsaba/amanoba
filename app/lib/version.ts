/**
 * Version Information System
 * 
 * What: Provides current app version and build information
 * Why: Helps users and developers identify which version is deployed
 * 
 * Version is read from package.json and bundled at build time
 */

import packageJson from '../../package.json';

export const APP_VERSION = packageJson.version;
export const APP_NAME = packageJson.name;
export const APP_DESCRIPTION = packageJson.description;

/**
 * Get formatted version string
 */
export function getVersionString(): string {
  return `v${APP_VERSION}`;
}

/**
 * Get build timestamp (set at build time)
 */
export function getBuildTimestamp(): string {
  return process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || new Date().toISOString();
}

/**
 * Get full version info
 */
export function getVersionInfo() {
  return {
    version: APP_VERSION,
    buildTime: getBuildTimestamp(),
    name: APP_NAME,
    description: APP_DESCRIPTION,
  };
}
