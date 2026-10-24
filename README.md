
✍️ Innocent Writer — Frontend
A thoughtful home for poetry, authors, and the stories behind every line.
React 19 · TypeScript · Vite · TanStack Query · Tailwind CSS v4
� � � �
A dedicated frontend repository for the Innocent Writer full-stack poetry platform.

🌿 The Experience
Innocent Writer gives poems a home beyond a fast-moving social feed. Readers can discover and read published poems, explore authors, and interact with writing. Authors can manage their work, while the administration area provides tools for platform management.
This repository contains the browser-facing application: page composition, navigation, visual design, client-side state, API communication, and accessible interaction patterns. Persistent data and business rules belong to the backend API.
✨ Product areas
Area
What it is for
Gateway / Home
A clear entry point to the poetry product and personal portfolio.
Poetry experience
Browse, search, paginate, and read published poems; open poem details and the poetry-book experience.
Reader interactions
Sign in to like poems and participate in comments.
Author experience
Create and manage poems and access author-oriented insights where authorized.
Portfolio
Present the author's profile, skills, projects, resume, and contact information.
Administration
Protected views for platform analytics, poem moderation, user management, and resume management.
Personalization
Shared light/dark theme support and reusable UI patterns.
Access to protected actions is ultimately enforced by the backend. Hiding or protecting a frontend route is a user-experience measure, not a substitute for server-side authorization.
🧭 Frontend architecture
The frontend is organized around layouts, routes, feature modules, shared components, and a centralized API layer. This keeps page rendering separate from server communication and keeps server state out of ad-hoc component logic.
Browser
  │
  ▼
React application (src/App.tsx)
  │
  ├── Shared layouts and route guards
  │     ├── Product / Poetry
  │     ├── Portfolio
  │     └── Admin
  │
  ├── Feature modules
  │     ├── auth
  │     ├── poems
  │     ├── comments
  │     ├── likes
  │     ├── analytics
  │     ├── admin
  │     └── portfolio
  │
  ├── TanStack Query — server-state cache and mutations
  │
  └── Feature API modules
        │
        ▼
   Shared Axios client
        │
        ▼
   Innocent Writer backend API
🧱 Main engineering choices
React + TypeScript: reusable components with explicit data contracts.
Vite: local development server and production asset bundling.
React Router: route-based navigation and separate product, portfolio, and admin areas.
TanStack Query: server-state fetching, caching, mutation lifecycle, and cache invalidation.
Axios: one shared HTTP client, common timeout and headers, bearer-token attachment, and normalized API errors.
Tailwind CSS v4 + shadcn/ui / Base UI: utility-first layout and reusable interface primitives.
Design tokens: shared semantic CSS variables for consistent light/dark themes.
Feature-first organization: API functions, query keys, and feature UI stay close to the domain they serve.
SEO utilities: reusable metadata support for public-facing pages.
🛠️ Technology stack
Concern
Technology
UI
React 19
Language
TypeScript
Tooling
Vite
Routing
React Router
Server state
TanStack Query
HTTP
Axios
Styling
Tailwind CSS v4
UI primitives
shadcn/ui with Base UI
Icons
Lucide React
OAuth UI
@react-oauth/google
Typography
Geist Variable
Book-style interaction
react-pageflip
Deployment target
Vercel
🚀 Run locally
Prerequisites
Node.js version compatible with the installed Vite toolchain
npm
Access to a running Innocent Writer backend, or a compatible API endpoint
1. Clone and install
git clone https://github.com/Ganesh907/innocent-writer-frontend.git
cd innocent-writer-frontend
npm install
2. Configure environment variables
Create a .env file in the project root:
# Backend API base URL. Use the deployed API URL for production.
# The client falls back to /api if this value is omitted.
VITE_API_BASE_URL=http://localhost:5000/api

# Google OAuth web client ID used by the frontend, when Google sign-in is enabled.
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id

# Optional portfolio payment/contact configuration, if the relevant UI is used.
VITE_UPI_ID=your_upi_id
Use the actual backend URL and OAuth client ID for your environment. Never put private keys, database credentials, JWT secrets, or Cloudinary API secrets in a VITE_ variable: Vite exposes these values to browser code.
3. Start development
npm run dev
Vite prints the local URL, typically http://localhost:5173.
4. Validate the application
npm run lint
npm run build
npm run preview
lint runs ESLint.
build runs TypeScript project builds and creates optimized production assets.
preview serves the production build locally.
⚙️ Configuration notes
API base URL
The shared Axios client reads VITE_API_BASE_URL. If it is not set, the client uses /api, which is useful when a deployment provides a same-origin proxy or rewrite. For a separately hosted API, set the full backend API base URL and configure backend CORS to allow the deployed frontend origin.
Authentication behavior
Feature API calls use the shared Axios client. When a token is available, the client attaches it as a bearer token. A 401 response clears the stored token and emits the application's session-expired event so the UI can respond consistently. The backend remains responsible for validating tokens and enforcing permissions.
Theme behavior
Theme state is managed centrally and applied through the shared theme system. Components should consume semantic tokens rather than introducing unrelated color palettes. This keeps the product, portfolio, and admin areas visually consistent.
🗂️ Repository map
src/
├── App.tsx
├── main.tsx
├── components/
│   ├── shared/          # Route guards, SEO, theme and shared behavior
│   ├── skeletons/       # Loading placeholders and page skeletons
│   └── ui/              # Reusable UI primitives
├── contracts/           # Typed API/auth/poem contracts
├── features/
│   ├── admin/
│   ├── analytics/
│   ├── auth/
│   ├── comments/
│   ├── likes/
│   ├── poems/
│   └── portfolio/
├── layouts/              # Shared and area-specific page shells
├── lib/
│   └── api/              # Axios client, query client and API errors
├── routes/               # Route-group definitions
├── styles/               # Shared design tokens
└── theme/                # Theme provider, context and hook
The tree is a conceptual guide; exact files can evolve as the application grows.
🔌 Backend relationship
The frontend is designed to consume the separate API repository:
Backend repository: innocent-writer-backend
Frontend repository: innocent-writer-frontend
Live application: innocentwriter.vercel.app
The browser never connects directly to PostgreSQL. Data travels through typed feature API functions and the shared HTTP client to the backend's REST endpoints.
🔐 Security and operational practices
Keep environment-specific URLs in environment configuration.
Never commit .env files or credentials.
Treat client-side route guards as UX controls; the API must enforce authentication and roles.
Avoid logging access tokens or private user data.
Keep API response contracts aligned with the backend.
Run lint and production build checks before merging changes.
Test guest, authenticated-user, and administrator journeys separately.
🧪 Verification
Useful local checks:
npm run lint
npm run build
These commands verify lint rules and the production compilation path. They do not by themselves prove that the deployed backend is reachable or that every end-to-end user flow works. For release verification, also check API connectivity, authentication, poem reading, comments/likes, portfolio pages, and protected admin screens against the intended environment.
🗺️ Roadmap mindset
The codebase is built to evolve without coupling every page to network details:
Keep domain-specific requests inside feature API modules.
Keep shared request behavior in the Axios client.
Use query keys consistently and invalidate relevant data after mutations.
Prefer reusable components and semantic theme tokens.
Keep public portfolio content distinct from authenticated product workflows.
Document behavior that has been verified; do not treat a successful build as proof of production health.
🤝 Contributing
Create a focused branch.
Make changes within the relevant feature or shared layer.
Run npm run lint and npm run build.
Test the affected route and its API behavior.
Open a pull request describing the user impact and verification performed.
📄 License
No explicit open-source license is declared in this repository. All rights and permissions remain with the copyright holder unless a license is added.

Made for the words worth keeping. ✨