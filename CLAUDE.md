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
4. **Proxy auth guard** — Session refresh on every request via `src/proxy.ts`, redirects unauthenticated users to `/login`
5. **Route group `(dashboard)`** — All authenticated pages share a layout with collapsible dark sidebar + topbar
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
  proxy.ts                                   # Auth session refresh + redirects (Next.js 16 proxy convention)
  lib/
    supabase/client.ts                       # Browser Supabase client (createBrowserClient)
    supabase/server.ts                       # Server Supabase client (cookie-based)
    supabase/middleware.ts                    # updateSession helper for proxy
    types/database.ts                        # TS types: Agent, Customer, CustomerContract, Case, Email, etc.
    constants.ts                             # German labels, badge color maps, company name, AI_LABELS
    textbausteine.ts                         # Template text library indexed by case category
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
    motion/
      page-transition.tsx                    # framer-motion page transition wrapper
    layout/
      sidebar.tsx                            # Collapsible dark sidebar with nav links, "use client"
      ai-sidebar.tsx                         # Fixed right panel: Kundeninfo / KI-Assistent / Textbausteine tabs
      topbar.tsx                             # Company logo, nav links (Fälle, Kunden), agent info, logout, "use client"
    auth/
      login-card.tsx                         # Branded card wrapper for login page
      login-form.tsx                         # Email/password form, "use client"
    cases/
      case-filters.tsx                       # 4 dropdowns (status/category/priority/agent), updates URL params
      case-table.tsx                         # HTML table with sortable columns
      animated-table-body.tsx                # framer-motion animated table body
      animated-row.tsx                       # framer-motion animated row
      case-row.tsx                           # Single table row with badges, links to /cases/[id]
    case-detail/
      case-detail-client.tsx                 # Client wrapper: owns AI state, renders main content + portals AiSidebar
      case-header.tsx                        # Back link, subject, badges
      case-actions.tsx                       # Assign/status/priority/agent controls, "use client"
      customer-sidebar.tsx                   # Customer info card + contracts list
      email-thread.tsx                       # Chronological email list
      email-message.tsx                      # Single email: inbound (gray) vs outbound (blue)
      reply-composer.tsx                     # Controlled textarea + send button, "use client"
      ai-assistance-pane.tsx                 # AI suggestion generation + EvaluateModal trigger, "use client"
      evaluate-modal.tsx                     # Chat-style AI evaluation modal with case context, "use client"
    customers/
      customer-info.tsx                      # Customer profile card with initials avatar
      customer-contracts.tsx                 # Contracts table (service, size, frequency, status)
      customer-cases.tsx                     # List of cases linked to customer
      customer-table.tsx                     # Customers list table
  app/
    layout.tsx                               # Root: <html lang="de">, Inter font, metadata
    globals.css                              # Tailwind v4 @theme with brand/ai/surface palette + semantic tokens
    error.tsx                                # Global error boundary (German text)
    login/page.tsx                           # Public login page with branding
    api/
      ai/suggest/route.ts                    # POST: Supabase auth → build German prompt → stream gpt-5-mini response
      ai/evaluate/route.ts                   # POST: Supabase auth → chat-style evaluation → stream gpt-4o-mini response
    (dashboard)/
      layout.tsx                             # Auth guard → fetch agent → sidebar + topbar shell
      page.tsx                               # Case inbox: filtered Supabase query + CaseFilters + CaseTable
      loading.tsx                            # Dashboard loading spinner
      cases/[id]/page.tsx                    # Case detail: Server data fetch → CaseDetailClient + AiSidebar portal
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
- Never use `getSession()` in proxy/server context — always use `getUser()` for security

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

The case detail page has a resizable right sidebar (`AiSidebar`) portaled to `document.body`:

```
CaseDetailPage (Server Component) — fetches case, emails, contracts, agents
  └─ CaseDetailClient (Client) — owns body + AI state, portals AiSidebar
       ├─ Left (margin-right = sidebar width): {children} + ReplyComposer
       └─ AiSidebar (portal, fixed right, resizable):
            ├─ Tab: Kundeninfo — customer address, phone, active/inactive contracts
            ├─ Tab: KI-Assistent — AiAssistancePane → POST /api/ai/suggest → streaming → "Vorschlag verwenden"
            │        └─ EvaluateModal button → POST /api/ai/evaluate → chat-style Q&A
            └─ Tab: Textbausteine — template browser filtered by category, "In Antwortfeld übernehmen"
```

- `ReplyComposer` is controlled (`body`/`onBodyChange` props lifted to `CaseDetailClient`)
- "Vorschlag verwenden" and template selection both call `onUseSuggestion` which sets the reply body
- Both AI routes authenticate via Supabase cookies before calling OpenAI
- Sidebar is resizable (drag handle on left edge, MIN 280px / MAX 680px)
- AI labels are centralized in `AI_LABELS` in `constants.ts`; templates in `lib/textbausteine.ts`

### German UI Labels

All user-facing text is in German. Label mappings live in `src/lib/constants.ts`. Date formatting uses `date-fns` with `de` locale.

### Tailwind v4

- No `tailwind.config.ts` — custom theme values defined via `@theme` + `@theme inline` in `globals.css`
- Palette colors (`surface-*`, `brand-*`, `ai-*`) defined in `@theme` (inlined hex values for Safari compat)
- Semantic tokens (`page`, `card`, `primary`, `edge`, etc.) defined in `@theme inline` (reference CSS vars)
- Brand color: emerald (`--color-brand-600: #059669`), AI color: blue (`--color-ai-600: #2563eb`)
- Uses `@tailwindcss/postcss` plugin (see `postcss.config.mjs`)

## Sensitive Files

- `.env.local` — Contains Supabase URL, anon key, and OpenAI API key (do NOT commit)
