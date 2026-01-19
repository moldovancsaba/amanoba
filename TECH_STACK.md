# Technology Stack

**Version**: 2.8.0  
**Last Updated**: 2025-01-20T23:00:00.000Z

---

## Frontend Technologies

### Core Framework
- **Next.js**: 15.5.2 (App Router)
- **React**: 18.3.1
- **TypeScript**: 5.5.3

### Styling & Design
- **Tailwind CSS**: 3.4.11
- **PostCSS**: 8.4.47
- **Autoprefixer**: 10.4.20
- **tailwind-merge**: 2.5.2
- **tailwindcss-animate**: 1.0.7
- **class-variance-authority**: 0.7.1
- **clsx**: 2.1.1

### UI Components
- **@radix-ui/react-dialog**: 1.1.2
- **@radix-ui/react-label**: 2.1.0
- **@radix-ui/react-progress**: 1.1.7
- **@radix-ui/react-scroll-area**: 1.2.10
- **@radix-ui/react-select**: 2.1.1
- **@radix-ui/react-slot**: 1.1.0
- **@radix-ui/react-tabs**: 1.1.13
- **@radix-ui/react-toast**: 1.2.1
- **@radix-ui/react-tooltip**: 1.2.8
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
- **Next.js API Routes**: 15.5.2 (App Router)

### Database
- **MongoDB**: 6.18.0 (MongoDB Atlas)
- **Mongoose**: 8.18.0 (ODM)

### Authentication
- **Facebook SDK**: OAuth 2.0
- **next-auth**: Session management

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

### Push Notifications
- **web-push**: 3.6.7

### Utilities
- **uuid**: 9.0.1
- **dotenv**: 17.2.3
- **qrcode**: 1.5.4

---

## Development Tools

### TypeScript
- **typescript**: 5.5.3
- **@types/node**: 22.5.5
- **@types/react**: 18.3.3
- **@types/react-dom**: 18.3.0
- **@types/uuid**: 9.0.8
- **@types/web-push**: 3.6.3

### Linting
- **ESLint**: 8.57.1
- **eslint-config-next**: 15.4.4

### Build Tools
- **@next/env**: 15.5.0

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
- **Domain**: TBD

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
    "node": ">=20.0.0",
    "npm": ">=9.0.0"
  }
}
```

## Dependency Overrides

```json
{
  "overrides": {
    "brace-expansion": "^2.0.2",
    "nanoid": "^3.3.8"
  }
}
```

---

**Maintained By**: Narimato  
**Review Cycle**: On dependency updates or security patches
