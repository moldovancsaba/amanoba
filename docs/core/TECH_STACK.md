# Technology Stack

**Version**: 2.9.49
**Last Updated**: 2026-05-25

---

## Frontend Technologies

### Core Framework
- **Next.js**: 16.2.6 (App Router)
- **React**: 19.2.6
- **TypeScript**: 5.9.3

### Styling & Design
- **Design/UI/UX SSOT**: `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM`
- **Shared upstream repo**: `https://github.com/sovereignsquad/general-design-system`
- **Target UI foundation**: Mantine-only shared contract; Amanoba uses the root Mantine runtime and shared pattern-service contracts.
- **@mantine/core**: 8.3.18
- **@mantine/hooks**: 8.3.18
- **@mantine/form**: 8.3.18
- **@mantine/notifications**: 8.3.18
- **@mantine/modals**: 8.3.18
- **@tabler/icons-react**: 3.44.0
- **Global CSS**: narrow document defaults, Mantine token bridge, rich lesson prose, and temporary legacy class contracts only.

### UI Components
- **Current runtime**: Mantine root runtime plus shared pattern-service contracts.
- **Target adapter**: Mantine primitives and thin project wrappers aligned to `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/COMPONENTS_AND_PATTERNS.md`.
- **Local GDS adoption contract**: `gds-adoption.json`, `docs/product/GDS_ADOPTION_MANIFEST.md`, and `docs/product/GDS_EXCEPTION_REGISTER.md`
- **lucide-react**: 0.462.0 (icons)

### Animation
- **Framer Motion**: 10.18.0

### Forms & Validation
- **react-hook-form**: 7.53.0
- **@hookform/resolvers**: 3.9.0
- **Zod**: 4.1.11

### Charts & Visualization
- **Recharts**: 3.2.1

### State Management
- **@tanstack/react-query**: 5.56.2
- **next-themes**: 0.4.6

### Utilities
- **date-fns**: 4.1.0
- **axios**: 1.7.9

---

## Backend Technologies

### Runtime & Framework
- **Node.js**: >= 20.0.0
- **Next.js API Routes**: 16.2.6 (App Router)

### Database
- **MongoDB**: 6.18.0 (MongoDB Atlas)
- **Mongoose**: 8.18.0 (ODM)

### Authentication
- **Primary auth**: SSO-only flow through `sso.doneisbetter.com`, implemented with NextAuth v5 and guarded by `auth.ts`, `auth.config.ts`, `auth.edge.ts`, and `proxy.ts`
- **Google sign-in**: First-class sign-in option routed through the SSO provider
- **Anonymous access**: Guest player flow for supported game/learning entry points
- **next-auth**: 5.0.0-beta.31 (session management)
- **@auth/mongodb-adapter**: 3.11.2

### Payment Processing
- **Stripe**: 20.2.0 (Payment processing for premium courses)
- **@stripe/stripe-js**: 8.6.1 (Client-side Stripe integration)

### Validation & Security
- **Zod**: 4.1.11
- **xss**: 1.0.15 (XSS protection)
- **rate-limiter-flexible**: 8.0.1

### Logging
- **Pino**: 9.13.0
- **pino-pretty**: 13.1.1

### Email Service
- **Email transport layer**: `app/lib/email/transports/*`
- **Providers**: Resend, Gmail API, or Mailgun, selected by `EMAIL_PROVIDER`
- **Default provider**: Resend when `EMAIL_PROVIDER` is unset

### Push Notifications
- **web-push**: 3.6.7

### Utilities
- **uuid**: 14.0.0
- **dotenv**: 17.2.3
- **qrcode**: 1.5.4

---

## Development Tools

### TypeScript
- **typescript**: 5.9.3
- **@types/node**: 20.19.40
- **@types/react**: 19.x
- **@types/react-dom**: 19.x
- **@types/web-push**: 3.6.3

### Linting
- **ESLint**: 9.x
- **eslint-config-next**: 16.2.6

### Build Tools
- **@next/env**: 16.2.6

---

## Deployment & Infrastructure

### Hosting
- **Platform**: Vercel (Serverless)
- **CDN**: Vercel Edge Network
- **SSL**: Automatic

### Database
- **MongoDB Atlas**
- **Cluster**: madoku-cluster.kqamwf8.mongodb.net
- **Database**: amanoba

### DNS & Domain
- **DNS**: Vercel DNS
- **Production domains**: `https://www.amanoba.com` and `https://amanoba.com`

---

## Performance & Monitoring

### Analytics
- **Vercel Analytics**: Real User Monitoring (RUM)
- **Google Analytics**: Optional (NEXT_PUBLIC_GA_ID)

### Monitoring
- **Vercel**: Error tracking, API latency
- **MongoDB Atlas**: Query performance, connection pool metrics

---

## Version Constraints

```json
{
  "engines": {
    "node": ">=20.0.0 <25.0.0",
    "npm": ">=10.0.0"
  }
}
```

## Dependency Overrides

```json
{
  "overrides": {
    "brace-expansion": "^2.0.2",
    "nanoid": "^3.3.8",
    "baseline-browser-mapping": "^2.9.0"
  }
}
```

---

**Maintained By**: Narimato
**Review Cycle**: On dependency updates or security patches
