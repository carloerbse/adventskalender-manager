# Adventskalender Manager - AI Coding Agent Instructions

## Project Overview
**Academic project (DHBW T4 Module)** - Deadline: 21.11.2025, 21:00

An **Adventskalender (Advent Calendar) planning application** for managing handmade advent calendars (24 "Säckchen"/pouches). Real-world use case: Supporting an Etsy shop selling handmade advent calendars, helping customers plan their filling contents.

### Architecture
**Split architecture** with separate runtimes:
- **Frontend**: Vue 3 + TypeScript + Vite SPA
- **Backend**: Deno HTTP server (NOT Node.js!)
- **Communication**: REST API with asynchronous operations

### Core Functionality
- User authentication (login/logout)
- Multi-user support (users see only their own calendars)
- CRUD operations for calendars
- 24 pouches per calendar (Säckchen 1-24) with:
  - Content description
  - Notes
  - "Packed" status (yes/no)
- **"Mischen" (shuffle) feature**: Server randomly redistributes contents across pouches 1-24
- Progress tracking (e.g., "17/24 packed")
- Export functionality (JSON/CSV)
- Admin role for user management

## Technology Stack

### Frontend
- **Vue 3** with `<script setup>` Composition API (required by project specs)
- **TypeScript** with strict mode
- **Vite** for dev server and bundling
- **SFC (Single File Components)** with scoped CSS
- Entry point: `src/main.ts` → `App.vue`

### Backend
- **Deno** (v1.x with std@0.224.0) - uses Deno standard library ONLY
- Server: `server/server.ts` on port 8000
- **Database**: SQLite (or similar integrated database preferred by specs)
- **REST API** with `/api/*` prefix
- Uses Deno imports: `https://deno.land/std@0.224.0/...`

### Critical: Dual Runtime
- Frontend: Node.js/npm (package.json exists)
- Backend: Deno (NO package.json for server)
- Never mix Node packages in Deno code or vice versa

## Developer Workflows

### Running the Application (Two Terminals Required)
```powershell
# Terminal 1: Frontend (Vite dev server, typically port 5173)
npm run dev

# Terminal 2: Backend (Deno server, port 8000)
deno run --allow-net --allow-read --allow-write server/server.ts
```

**Critical permissions for Deno**:
- `--allow-net` - HTTP server and API calls
- `--allow-read` - Database access, file reading
- `--allow-write` - Database persistence, file writing

### Build & Testing
```powershell
npm run build    # TypeScript compile + Vite build
npm run preview  # Preview production build
```

### Deployment (Optional for Submission)
- Can run on **Deno Deploy** with HTTP Basic Auth
- Hardcoded credentials for grading: `t4exam` / `SuperKurs`
- Must document deployment URL separately from local setup

## Project-Specific Conventions

### Vue Component Structure
- **Mandatory**: Use `<script setup lang="ts">` for all components (Composition API required by specs)
- Props: `defineProps<{ propName: type }>()`
- Reactive state: `ref()` and `reactive()` from Vue's Composition API
- Multiple components required (don't put everything in `App.vue`)
- Reactivity must be used wherever it makes sense
- Example: `src/components/HelloWorld.vue`

### API Design Patterns
- **All API routes**: `/api/*` prefix
- **Async communication**: Use REST API, not just form submissions
- **Current endpoint**: `/api/hello` (demo only)
- **Planned endpoints**:
  - `/api/auth/login`, `/api/auth/logout`
  - `/api/calendars` (CRUD for calendars)
  - `/api/calendars/:id/pouches` (24 Säckchen per calendar)
  - `/api/calendars/:id/shuffle` (server-side random redistribution)
  - `/api/calendars/:id/export` (JSON/CSV)
  - `/api/admin/users` (admin only)

### Security Requirements (Project Specs)
- **User isolation**: Users see ONLY their own calendars
- **Server-side validation**: All data validation on backend
- **Authentication**: Login required for all features
- **Role-based access**: Admin role for user management
- **Protection**: Use framework capabilities against common web attacks

### TypeScript Configuration
- Strict mode enabled with additional checks:
  - `noUnusedLocals`, `noUnusedParameters`
  - `noFallthroughCasesInSwitch`
  - `noUncheckedSideEffectImports`
- Separate configs: `tsconfig.app.json` (Vue/Vite), `tsconfig.node.json` (Node config)

### Styling Guidelines
- Uses **scoped CSS** in Vue SFCs (mandatory)
- Global styles in `src/style.css` with dark/light mode
- Focus on functionality over aesthetics (per project specs)
- Must be usable, doesn't need to be "fancy"

## Data Model (Core Entities)

### Calendar
- Belongs to one user
- Contains 24 Säckchen (pouches)
- Tracks overall progress (e.g., "17/24 gepackt")
- Can be created, read, updated, deleted

### Säckchen (Pouch)
- Number: 1-24 (fixed per calendar)
- Content: String description
- Notes: String (optional)
- Packed: Boolean
- Belongs to one calendar

### User
- Authentication credentials
- Role: normal user or admin
- Can have multiple calendars
- Admin can manage other users

### Key Business Logic
- **"Mischen" (Shuffle)**: Server-side operation that randomly redistributes content across pouches 1-24 within a calendar
- **Progress calculation**: Server computes and returns "X/24 packed" status
- **Export**: Generate JSON/CSV of calendar contents

## Important Integration Points

### Frontend ↔ Backend Communication
- **Current state**: Minimal integration (only demo `/api/hello`)
- **Required**: Implement full REST API with async calls using `fetch()`
- **CORS**: Configure on Deno server for `localhost:5173` (Vite dev server)
- **Session management**: Users can work across different clients seamlessly

### Database Integration (To Implement)
- **Preferred**: SQLite (integrated with Deno) or similar
- **Storage**: Must be server-side, centralized
- **Persistence**: Data survives server restarts
- **User isolation**: Enforce at database query level

### File Structure Logic
- `src/` - Vue frontend (Node.js context)
- `server/` - Deno backend (separate runtime)
- `public/` - Static assets (served by Vite)
- Root configs - Frontend tooling only

## When Adding Features

### For CRUD Operations
1. Define API endpoint in `server/server.ts` with proper HTTP methods
2. Implement server-side validation
3. Create Vue component with form and async calls
4. Use `ref()` for reactive form state
5. Handle loading states and errors in UI
6. Test with Postman before frontend integration

### For Authentication
1. Implement session management on server (Deno)
2. Store session state (in-memory or database)
3. Protect all API routes except login
4. Create login component with reactive form
5. Store auth state in Vue (e.g., Pinia or `ref()`)
6. Redirect unauthorized requests to login

### For the "Mischen" Feature
1. Server endpoint receives calendar ID
2. Server loads all 24 pouches with their contents
3. Server shuffles content-to-number mapping
4. Server persists new mapping to database
5. Server returns updated pouches array
6. Frontend updates reactive state with new data
7. User sees immediately updated pouch assignments

### For Export Functionality
1. Server endpoint generates JSON/CSV from calendar data
2. Return as download with proper headers
3. Frontend triggers download via API call
4. Consider: Let user choose format (JSON vs CSV)

## Testing Strategy
- **Backend**: Test API endpoints with Postman
- **Frontend**: Manual testing in browser
- **Cross-origin**: Test frontend calling backend during development
- **User scenarios**: Test login, create calendar, manage pouches, shuffle, export

## Documentation Requirements (For Submission)
Must include:
- Installation/setup instructions (step-by-step)
- Usage scenarios with screenshots
- Technology choices and justifications
- List of self-created vs. external files
- Client-server interaction descriptions
- Reflection on learning process

## German Language Context
All user-facing content is in German - maintain this for:
- UI labels and buttons
- API response messages
- Error messages
- Documentation for end users

## KI Usage Disclosure
Per project specs, document all AI tools used:
- ChatGPT (https://chat.openai.com/)
- Claude (https://claude.ai/)
- Grok (https://grok.com/)
- GitHub Copilot (this tool)

You are responsible for all generated code, including AI-generated portions.
