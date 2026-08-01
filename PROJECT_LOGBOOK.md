# 🛡️ RepoGuard - Daily Development Logbook

**Project Name:** RepoGuard (AI-Powered Security Posture Management)  
**Developer:** Prajesh (GitHub: [prajesh7894](https://github.com/prajesh7894))  
**Objective:** Build a full-stack, real-time security scanning platform that analyzes GitHub repositories for secrets, vulnerabilities, and misconfigurations.

---

### 🚀 Daily Development Timeline

| Day | Date | Daily Focus | Status |
| :---: | :---: | :--- | :---: |
| **Day 1** | `15/07/2026` | Project Setup & Initialization (Vite, React, TS) | ✅ |
| **Day 2** | `16/07/2026` | Tailwind CSS & Dark Mode Design System | ✅ |
| **Day 3** | `17/07/2026` | Frontend Architecture & Core Routing | ✅ |
| **Day 4** | `18/07/2026` | Dashboard & Repositories UI Implementation | ✅ |
| **Day 5** | `19/07/2026` | NewScan Wizard & ScanHistory UI | ✅ |
| **Day 6** | `20/07/2026` | Iconography (Lucide) & Chart Scaffolding (Recharts) | ✅ |
| **Day 7** | `21/07/2026` | Backend Server Initialization | ✅ |
| **Day 8** | `22/07/2026` | Database Architecture (Prisma & SQLite) | ✅ |
| **Day 9** | `23/07/2026` | Git Repository Cloning Engine | ✅ |
| **Day 10** | `24/07/2026` | Regex Entropy Rules for Secret Detection | ✅ |
| **Day 11** | `25/07/2026` | Vulnerability Scanning Rules (XSS, Eval, Exec) | ✅ |
| **Day 12** | `26/07/2026` | Real-Time Live Streaming via SSE | ✅ |
| **Day 13** | `27/07/2026` | Database Persistence for Scan Results | ✅ |
| **Day 14** | `28/07/2026` | Dynamic Data Visualization (Recharts integration) | ✅ |
| **Day 15** | `29/07/2026` | Async Background Task Engine & Scanning Queue | ✅ |
| **Day 16** | `30/07/2026` | Enterprise Backend Architecture (RBAC, Webhooks, Cron) | ✅ |
| **Day 17** | `31/07/2026` | AI Integration & Professional PDF Generation | ✅ |
| **Day 18** | `01/08/2026` | Advanced Secret Detection Heuristics | ✅ |

---

## 📅 Day 1: Project Setup & Initialization
**Date:** `15/07/2026`
- **Tasks:** Bootstrapped the frontend codebase using Vite. Configured React and TypeScript for strict typing. Established folder structure.
- **Outcome:** Clean working environment ready for component development.

## 📅 Day 2: Tailwind CSS & Dark Mode Design System
**Date:** `16/07/2026`
- **Tasks:** Configured Tailwind CSS utility classes. Defined global CSS variables for a premium "dark mode" aesthetic including glassmorphism UI rules and neon accents.
- **Outcome:** A highly polished, hacker-chic visual language established for the platform.

## 📅 Day 3: Frontend Architecture & Core Routing
**Date:** `17/07/2026`
- **Tasks:** Implemented `react-router-dom` in `App.tsx`. Created the Sidebar navigation and top Header layouts.
- **Outcome:** Seamless SPA navigation between empty placeholder routes.

## 📅 Day 4: Dashboard & Repositories UI
**Date:** `18/07/2026`
- **Tasks:** Built out the static structural layout for the `Dashboard` and the `Repositories` list views using mock data.
- **Outcome:** The primary command center visually took shape.

## 📅 Day 5: NewScan Wizard & ScanHistory UI
**Date:** `19/07/2026`
- **Tasks:** Constructed the multi-step `NewScan` wizard for users to input repository URLs. Designed the historical scan logs page.
- **Outcome:** Completed the frontend static layouts for all core user flows.

## 📅 Day 6: Iconography & Chart Scaffolding
**Date:** `20/07/2026`
- **Tasks:** Integrated `lucide-react` to replace placeholder icons. Installed `recharts` and created empty chart wrapper components.
- **Outcome:** The UI now looks significantly more professional and interactive.

## 📅 Day 7: Backend Server Initialization
**Date:** `21/07/2026`
- **Tasks:** Shifted focus to the backend. Set up an Express/FastAPI foundation to serve API endpoints independently from the Vite dev server.
- **Outcome:** The API layer is live and accepting local requests.

## 📅 Day 8: Database Architecture (Prisma & SQLite)
**Date:** `22/07/2026`
- **Tasks:** Configured Prisma ORM connected to a local SQLite database file. Defined `User`, `Repository`, and `Scan` schemas.
- **Outcome:** Relational database foundation established and successfully migrated.

## 📅 Day 9: Git Repository Cloning Engine
**Date:** `23/07/2026`
- **Tasks:** Engineered the core physical scanning utility. Implemented Git repository cloning into isolated, temporary workspaces on the server.
- **Outcome:** RepoGuard can now successfully fetch target repositories over the network.

## 📅 Day 10: Regex Entropy Rules for Secret Detection
**Date:** `24/07/2026`
- **Tasks:** Built a recursive file system reader. Authored complex regex rules to detect hardcoded secrets like AWS keys, GitHub PATs, and bearer tokens.
- **Outcome:** The engine can successfully detect exposed credentials in source code.

## 📅 Day 11: Vulnerability Scanning Rules
**Date:** `25/07/2026`
- **Tasks:** Expanded the scanning engine by authoring patterns to detect code injection vulnerabilities (`eval()`, `exec()`, `innerHTML` risks).
- **Outcome:** The tool evolved from a secret-scanner into a full vulnerability scanner.

## 📅 Day 12: Real-Time Live Streaming via SSE
**Date:** `26/07/2026`
- **Tasks:** Upgraded the `NewScan` wizard to connect to `/api/scans/stream`. Implemented Server-Sent Events (SSE) to push live terminal logs to the frontend.
- **Outcome:** Users see a beautiful, real-time terminal output as their code is being analyzed.

## 📅 Day 13: Database Persistence for Scan Results
**Date:** `27/07/2026`
- **Tasks:** Intercepted the completed scan JSON outputs on the backend and wired them to `models.Scan` inserts.
- **Outcome:** Scan findings are no longer lost; they are permanently stored in the SQLite database.

## 📅 Day 14: Dynamic Data Visualization
**Date:** `28/07/2026`
- **Tasks:** Hooked the frontend Dashboard directly to the database. Rendered a dynamic Recharts Pie Chart (Critical vs High vs Secrets) and a 7-day vulnerability line chart.
- **Outcome:** The dashboard is now a fully data-driven analytics command center.

## 📅 Day 15: Async Background Task Engine
**Date:** `29/07/2026`
- **Tasks:** Migrated the backend scanning logic into FastAPI `BackgroundTasks`. Decoupled the scanning engine from the main API thread to prevent blocking requests during heavy repository clones.
- **Outcome:** The server can now smoothly accept multiple concurrent scan requests without performance degradation.

## 📅 Day 16: Enterprise Backend Architecture (Phase 1)
**Date:** `30/07/2026` *(Today)*
- **Tasks:**
  - Implemented Role-Based Access Control (RBAC) with `Organization` models.
  - Refactored the monolithic scanner into a Modular Plugin Architecture.
  - Integrated `bandit` as a Python AST scanner plugin.
  - Integrated `APScheduler` for automated nightly cron job scans.
  - Implemented secure GitHub Webhooks for autonomous CI/CD scanning on push.
- **Outcome:** The backend is now a robust, multi-tenant enterprise system.

## 📅 Day 17: AI Integration & PDF Generation
**Date:** `31/07/2026` *(Today)*
- **Tasks:**
  - Designed and built a robust PDF Report generator (`html2pdf.js`) rendering professional-grade static reports directly from dynamic React components.
  - Integrated Google Gemini LLM for AI-driven code vulnerability analysis.
  - Successfully debugged complex FastAPI background task lifecycle errors and `google-genai` SDK garbage collection crashes by rewriting the integration to use raw asynchronous HTTP requests (`httpx.AsyncClient`).
  - Implemented dynamic API model resolution and error handling for robust text generation via `gemini-flash-latest`.
- **Outcome:** The platform now offers highly polished PDF exports and state-of-the-art AI code reviews seamlessly integrated into the user workflow.

## 📅 Day 18: Advanced Secret Detection Heuristics
**Date:** `01/08/2026` *(Today)*
- **Tasks:**
  - Expanded the `regex.py` plugin with high-confidence patterns targeting Stripe Secret Keys, Slack Tokens, Google (GCP) API Keys, Twilio API Keys, and RSA/PGP Private Keys.
  - Engineered a mathematical secret detection heuristic using Shannon Entropy in the `secrets.py` plugin.
  - Configured the entropy engine to scan for long, contiguous alphanumeric blocks (e.g., base64/hex) and flag highly unpredictable strings (entropy > 4.5) as potential undocumented secrets.
- **Outcome:** RepoGuard can now intelligently detect both explicitly patterned tokens and entirely random, custom cryptographic keys embedded in source code.

---

### 🎯 Next Planned Milestones
- [x] Implement additional secret detection heuristics.
