# Version Management

Documentation for managing Amanoba platform versions and releases.

## Current Version

**Version:** 2.10.0

**Last Updated:** 2026-08-06

## Version Display

The platform version is visible to users in the following locations:

- **Landing Page Footer**: Full version with build timestamp and commit SHA
- **Dashboard**: Version badge at the bottom of the page
- **API Endpoint**: `GET /api/version` returns complete version metadata

## Version Information System

The version system provides:

- **Version Number**: Semantic versioning (MAJOR.MINOR.PATCH) from `package.json`
- **Build Timestamp**: When the current deployment was built (set via `NEXT_PUBLIC_BUILD_TIMESTAMP`)
- **Commit SHA**: Git commit hash (first 7 characters) from Vercel environment
- **Branch**: Git branch name from Vercel environment
- **Environment**: Deployment environment (production, preview, development)

## How to Update Version

### Automatic Version Bumping

Use npm scripts to bump version and create a release commit:

```bash
# Patch release (2.9.49 → 2.9.50) - Bug fixes
npm run release:patch

# Minor release (2.9.49 → 2.10.0) - New features
npm run release:minor

# Major release (2.9.49 → 3.0.0) - Breaking changes
npm run release:major
```

These scripts will:
1. Update `package.json` version
2. Update this documentation file
3. Create a commit with standardized message

### Manual Version Update

If you need to update the version manually:

1. **Edit `package.json`**:
   ```json
   {
     "version": "X.Y.Z"
   }
   ```

2. **Update this file (`docs/VERSION.md`)**:
   - Change "Current Version" section
   - Update "Last Updated" date

3. **Commit changes**:
   ```bash
   git add package.json docs/VERSION.md
   git commit -m "release: vX.Y.Z — Brief description"
   git push origin preview
   ```

## Semantic Versioning

We follow [Semantic Versioning 2.0.0](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes, incompatible API changes
- **MINOR** (0.X.0): New features, backward-compatible functionality
- **PATCH** (0.0.X): Bug fixes, backward-compatible fixes

### Examples

- **2.9.49 → 2.9.50**: Fixed certificate download bug
- **2.9.49 → 2.10.0**: Added progressive course generation system
- **2.9.49 → 3.0.0**: Complete authentication system overhaul

## Build Timestamp

The build timestamp is automatically set by Vercel during deployment and available via the `NEXT_PUBLIC_BUILD_TIMESTAMP` environment variable. For local development, it defaults to the current time.

## Version API

### Endpoint: `GET /api/version`

Returns complete version information:

```json
{
  "success": true,
  "data": {
    "version": "2.9.49",
    "buildTime": "2026-08-06T18:30:00.000Z",
    "name": "amanoba",
    "environment": "production",
    "vercelEnv": "production",
    "commitSha": "a1b2c3d",
    "branch": "main"
  }
}
```

## Version Display Component

The `VersionDisplay` component (`app/components/VersionDisplay.tsx`) fetches version data from the API and displays it to users.

**Props:**
- `compact?: boolean` - Shows compact badge version instead of full info

**Usage:**

```tsx
import { VersionDisplay } from '@/app/components/VersionDisplay';

// Full display with timestamp and commit
<VersionDisplay />

// Compact badge
<VersionDisplay compact />
```

## Deployment and Version Tracking

### Preview Deployments

Each push to the `preview` branch creates a new Vercel preview deployment with:
- Current `package.json` version
- Build timestamp of the deployment
- Commit SHA of the pushed code
- Branch name ("preview")

### Production Deployments

Production deployments from the `main` branch follow the same pattern but with:
- Environment: "production"
- Branch: "main"
- All quality gates must pass before deployment

## Troubleshooting

### Version not updating in UI

If the version displayed doesn't match `package.json`:

1. Clear browser cache (hard refresh: Ctrl+Shift+R / Cmd+Shift+R)
2. Check if the API endpoint returns correct version: `curl https://amanoba.com/api/version`
3. Verify deployment completed successfully on Vercel dashboard
4. Wait 5 minutes for CDN cache to clear (API has 5-minute cache)

### Build timestamp shows as current time

This is expected in local development. The `NEXT_PUBLIC_BUILD_TIMESTAMP` environment variable is only set during Vercel builds.

## Documentation Updates

When updating the version, also update:

1. **This file (`docs/VERSION.md`)**: Current version and last updated date
2. **`docs/HANDOVER.md`**: Append entry if runtime behavior changed
3. **`RELEASE_NOTES.md`**: Document what changed in this version

## Git Workflow

1. Make changes on feature branch
2. Test on preview deployment
3. Update version using release scripts
4. Push to `preview` branch for final testing
5. Merge to `main` for production deployment
6. Tag release in GitHub (optional): `git tag v2.9.49 && git push --tags`

## Related Documentation

- [READMEDEV.md](../READMEDEV.md) - Developer workflow and quality gates
- [HANDOVER.md](HANDOVER.md) - Runtime changes log
- [RELEASE_NOTES.md](../RELEASE_NOTES.md) - Feature changelog
