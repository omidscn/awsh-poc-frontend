# AWSH Frontend — Stadtreinigung Weber GmbH Agent Dashboard

## Project Overview

Internal customer service dashboard for a German waste management company (Stadtreinigung Weber GmbH). Agents use this tool to manage support cases, view email threads, update case status, and access customer profiles. All UI text is in German.

## Tech Stack

- **Next.js 16** (App Router, `src/` directory)
- **React 19**, **TypeScript 5**
- **Tailwind CSS v4** (configured via `@theme inline` in `globals.css`, no `tailwind.config.ts`)
- **@supabase/supabase-js** + **@supabase/ssr** (SSR cookie-based auth)
- **date-fns** (German locale date formatting)
- **clsx** (class merging utility)
- **openai** (OpenAI SDK for AI-powered reply suggestions)

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build (also verifies TypeScript)
npm run start    # Run production build
npm run lint     # ESLint
```

## Architecture

### Key Decisions

1. **Server Components by default** — Client Components (`"use client"`) only where needed: forms, filters, action buttons, logout
2. **URL-based filtering** — Case inbox filters stored as search params (shareable, back-button friendly)
3. **`router.refresh()` after mutations** — No client-side state management; mutations re-invoke Server Components for fresh data
4. **Middleware auth guard** — Session refresh on every request, redirects unauthenticated users to `/login`
5. **Route group `(dashboard)`** — All authenticated pages share topbar-only layout (no sidebar)
6. **Direct Supabase queries** — No backend API; RLS policies handle authorization (all authenticated users can read all tables, update cases, insert emails)
7. **AI reply suggestions** — OpenAI streaming via `/api/ai/suggest` Route Handler; CaseDetailClient lifts reply body state so AI pane and composer can share it

### Supabase Connection

- Self-hosted Supabase at the URL in `.env.local`
- Auth via `signInWithPassword` (email + password)
- Cookie-based session management for SSR compatibility
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### OpenAI Connection

- Used for AI-powered reply suggestions on the case detail page
- Streaming responses via `gpt-5-mini` model
- Server-only env variable: `OPENAI_API_KEY` (no `NEXT_PUBLIC_` prefix)
- API route at `/api/ai/suggest` — authenticates via Supabase session before calling OpenAI

## File Structure

```
src/
  middleware.ts                              # Auth session refresh + redirects
  lib/
    supabase/client.ts                       # Browser Supabase client (createBrowserClient)
    supabase/server.ts                       # Server Supabase client (cookie-based)
    supabase/middleware.ts                    # updateSession helper for middleware
    types/database.ts                        # TS types: Agent, Customer, CustomerContract, Case, Email, etc.
    constants.ts                             # German labels, badge color maps, company name, AI_LABELS
    utils.ts                                 # cn(), formatDate/DateTime/Relative(), getInitials(), getFullName()
  components/
    ui/                                      # Reusable UI primitives
      badge.tsx                              # Status/priority/category badges with color lookup
      button.tsx                             # primary/secondary/danger/ghost variants, loading state
      input.tsx                              # Input + Textarea with label/error support
      select.tsx                             # Native select with options array
      card.tsx                               # Card/CardHeader/CardTitle/CardContent compound
      spinner.tsx                            # SVG loading spinner
      empty-state.tsx                        # "No results" placeholder
    layout/
      sidebar.tsx                            # (Legacy) Dark sidebar — no longer rendered, nav moved to topbar
      topbar.tsx                             # Company logo, nav links (Fälle, Kunden), agent info, logout, "use client"
    auth/
      login-form.tsx                         # Email/password form, "use client"
    cases/
      case-filters.tsx                       # 4 dropdowns (status/category/priority/agent), updates URL params
      case-table.tsx                         # HTML table with sortable columns
      case-row.tsx                           # Single table row with badges, links to /cases/[id]
    case-detail/
      case-detail-client.tsx                 # Client wrapper: owns reply body state + tab state, renders split layout
      case-header.tsx                        # Back link, subject, badges
      case-actions.tsx                       # Assign/status/priority/agent controls, "use client"
      customer-sidebar.tsx                   # Customer info card + contracts list
      email-thread.tsx                       # Chronological email list
      email-message.tsx                      # Single email: inbound (gray) vs outbound (blue)
      reply-composer.tsx                     # Controlled textarea + send button + "KI-Vorschlag" trigger, "use client"
      ai-assistance-pane.tsx                 # AI pane: context summary, instructions input, streaming suggestion, "use client"
    customers/
      customer-info.tsx                      # Customer profile card with initials avatar
      customer-contracts.tsx                 # Contracts table (service, size, frequency, status)
      customer-cases.tsx                     # List of cases linked to customer
  app/
    layout.tsx                               # Root: <html lang="de">, Inter font, metadata
    globals.css                              # Tailwind v4 @theme with brand colors
    error.tsx                                # Global error boundary (German text)
    login/page.tsx                           # Public login page with branding
    api/
      ai/suggest/route.ts                    # POST: Supabase auth → build German prompt → stream OpenAI response
    (dashboard)/
      layout.tsx                             # Auth guard → fetch agent → topbar-only shell (no sidebar)
      page.tsx                               # Case inbox: filtered Supabase query + CaseFilters + CaseTable
      loading.tsx                            # Dashboard loading spinner
      cases/[id]/page.tsx                    # Case detail: Server data fetch → CaseDetailClient wrapper with tabbed right panel
      cases/[id]/loading.tsx                 # Case detail loading spinner
      cases/[id]/not-found.tsx               # 404 for missing cases (German)
      customers/[id]/page.tsx                # Customer profile: info, contracts, cases
```

## Database Schema

Connected to a self-hosted Supabase with these tables:

| Table | Rows | Description |
|---|---|---|
| `agents` | 5 | Company employees (linked to auth.users by id) |
| `customers` | 100 | Garbage service subscribers |
| `customer_contracts` | 328 | Service subscriptions (bins, pickup frequency) |
| `cases` | 200 | Support tickets |
| `emails` | 636 | Email messages within cases |
| `attachments` | 0 | (Future use) |

### Key Types

- **Case statuses**: `open`, `in_progress`, `resolved`, `closed`
- **Case priorities**: `high`, `medium`, `low`
- **Case categories**: `tonnenbereitstellung`, `abholung_verpasst`, `sperrmuell`, `rechnung`, `tonnentausch`, `adressaenderung`, `beschwerde`, `allgemein`
- **Service types**: `restmuell`, `biomuell`, `papier`, `gelber_sack`, `sperrmuell`
- **Email directions**: `inbound` (customer→company), `outbound` (agent→customer)

### RLS Policies

- SELECT on all tables: any authenticated user
- UPDATE on cases: any authenticated user
- INSERT on emails: any authenticated user

## Test Accounts

All passwords: `Agent2025!`

| Email | Role |
|---|---|
| stefan.mueller@stadtreinigung-weber.de | admin |
| sabine.schmidt@stadtreinigung-weber.de | supervisor |
| thomas.becker@stadtreinigung-weber.de | agent |
| andrea.hoffmann@stadtreinigung-weber.de | agent |
| markus.klein@stadtreinigung-weber.de | agent |

## Patterns & Conventions

### Supabase Client Usage

- **Server Components / Route Handlers**: Use `createClient()` from `@/lib/supabase/server` (async, cookie-based)
- **Client Components**: Use `createClient()` from `@/lib/supabase/client` (browser client)
- Never use `getSession()` in middleware — always use `getUser()` for security

### Component Patterns

- UI components use `forwardRef` where applicable (Button, Input, Select)
- `cn()` from `@/lib/utils` for conditional class merging
- Badge component does label + color lookup from constants via `variant` prop (`"status"`, `"priority"`, `"category"`)
- Card uses compound component pattern: `Card`, `CardHeader`, `CardTitle`, `CardContent`

### Mutation Pattern

```tsx
// Client Component pattern for mutations:
const supabase = createClient();       // browser client
const router = useRouter();

await supabase.from("cases").update({ status: "resolved" }).eq("id", caseId);
router.refresh();                       // re-runs Server Component to get fresh data
```

### AI Reply Suggestion Flow

The case detail page has a tabbed right panel ("Kundeninfo" / "KI-Assistent"):

```
CaseDetailPage (Server Component) — fetches case, emails, contracts, agents
  └─ CaseDetailClient (Client) — owns body state + activeTab
       ├─ Left: {children} (CaseHeader, CaseActions, EmailThread) + ReplyComposer
       └─ Right (w-96): Tab bar → CustomerSidebar OR AiAssistancePane
            └─ AiAssistancePane → POST /api/ai/suggest → streaming OpenAI → "Vorschlag verwenden"
```

- `ReplyComposer` is controlled (`body`/`onBodyChange` props lifted to `CaseDetailClient`)
- "KI-Vorschlag" button in composer switches to the AI tab
- "Vorschlag verwenden" in AI pane inserts text into the composer and switches back to customer tab
- API route authenticates via Supabase cookies, builds a German system prompt with full case context, streams `gpt-5-mini` response
- AI labels are centralized in `AI_LABELS` in `constants.ts`

### German UI Labels

All user-facing text is in German. Label mappings live in `src/lib/constants.ts`. Date formatting uses `date-fns` with `de` locale.

### Tailwind v4

- No `tailwind.config.ts` — custom theme values defined via `@theme inline` in `globals.css`
- Brand color: green (`--color-brand-600: #16a34a`)
- Uses `@tailwindcss/postcss` plugin (see `postcss.config.mjs`)

## Sensitive Files

- `.env.local` — Contains Supabase URL, anon key, and OpenAI API key (do NOT commit)
