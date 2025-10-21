# Project Structure

## Root Configuration Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `next.config.mjs` - Next.js configuration
- `postcss.config.mjs` - PostCSS configuration
- `middleware.ts` - Next.js middleware for auth

## App Directory (`/app`)
\`\`\`
app/
├── layout.tsx              # Root layout with metadata
├── page.tsx                # Landing page
├── globals.css             # Global styles
├── auth/
│   ├── login/page.tsx      # Login page
│   ├── sign-up/page.tsx    # Sign-up page
│   ├── sign-up-success/page.tsx  # Success page
│   └── error/page.tsx      # Error page
├── dashboard/
│   └── page.tsx            # Main dashboard
├── settings/
│   └── page.tsx            # Settings page
└── api/
    └── evals/
        └── ingest/route.ts # API endpoint for ingestion
\`\`\`

## Components (`/components`)
\`\`\`
components/
├── ui/                     # Shadcn UI components
├── kpi-card.tsx           # KPI display card
├── eval-detail-sheet.tsx  # Evaluation details viewer
└── trend-chart.tsx        # Trend visualization
\`\`\`

## Library (`/lib`)
\`\`\`
lib/
└── supabase/
    ├── client.ts          # Browser Supabase client
    ├── server.ts          # Server Supabase client
    └── middleware.ts      # Supabase middleware
\`\`\`

## Scripts (`/scripts`)
\`\`\`
scripts/
├── 001_create_tables.sql  # Database schema
├── 002_rls_policies.sql   # Row-level security
└── seed-supabase.ts       # Seed data script
\`\`\`

## Key Features

### Authentication
- Supabase Auth with email/password
- Session management
- Protected routes via middleware
- User isolation with RLS

### Dashboard
- Real-time KPI metrics
- Trend charts (7-day, 30-day)
- Searchable evaluations table
- Detailed evaluation viewer

### Settings
- Configurable run policies
- Sample rate control
- Daily limits
- PII obfuscation toggle

### API
- RESTful endpoint for evaluation ingestion
- Request validation
- Sampling enforcement
- Daily limit enforcement

## Technology Stack
- **Framework**: Next.js 15.5.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Shadcn UI + Radix UI
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
