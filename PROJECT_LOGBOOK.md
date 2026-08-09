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
| **Day 19** | `08/08/2026` | Autonomous GitHub PR Remediation | ✅ |
| **Day 20** | `09/08/2026` | Real GitHub API PR Orchestration | ✅ |

---

## 📅 Day 20: Real GitHub API PR Orchestration
**Date:** `09/08/2026`
- **Tasks:** Rewrote the Auto-Fix PR endpoint from a mock stub to a real GitHub REST API orchestrator. The backend now authentically clones, patches, creates branches, commits, and opens official Pull Requests on behalf of the authenticated user to automatically remediate security vulnerabilities. Handled OAuth token persistence and detailed API error logging.
- **Outcome:** RepoGuard is now officially a fully autonomous active remediation engine capable of generating real GitHub Pull Requests.

---

## 📅 Day 19: Autonomous GitHub PR Remediation
**Date:** `08/08/2026`
- **Tasks:** Engineered full OAuth flow with GitHub to link user accounts. Built the Autonomous Auto-Fix feature that allows the AI to generate a code patch and automatically open a Pull Request on the vulnerable repository. Handled database migrations and edge cases regarding cross-origin routing.
- **Outcome:** The application evolved from a passive scanner to an active remediation engine capable of fixing code autonomously.

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

## 📅 Day 19: Full System Wireup & Real Data Integration
**Date:** `02/08/2026` *(Today)*
- **Tasks:**
  - Added user preferences state directly to the database via Prisma schema / SQLite `User` table migrations.
  - Engineered the backend `Notification` models and wired them to the background scanning engine for dynamic alerts.
  - Replaced all frontend hardcoded mock data across Scanners (Secrets & Dependencies), Reports, and Notification views with functional API calls fetching dynamic, real-time data.
  - Ensured JWT auth tokens correctly flow through all new API routes, and successfully resolved complex schema mismatch bugs during integration.
- **Outcome:** The prototype evolved into a cohesive, professional-grade application successfully exchanging real telemetry and security findings from end-to-end.

## 📅 Day 20: JSON Data Export Engine
**Date:** `03/08/2026` *(Today)*
- **Tasks:**
  - Designed and deployed the `GET /api/scans/{id}/export/json` endpoint in FastAPI.
  - Implemented correct HTTP headers (`Content-Disposition: attachment`) for robust, native browser file downloads.
  - Re-architected frontend components (`Reports.tsx`, `ScanHistory.tsx`) to directly interface with the backend export route, deprecating fragile client-side JSON blob generation.
- **Outcome:** A robust data egress point was established, enabling CI/CD integrations and SIEM ingestions of raw scanner telemetry.

## 📅 Day 21: CSV Data Export Engine
**Date:** `04/08/2026` *(Today)*
- **Tasks:**
  - Designed and deployed `GET /api/scans/export/csv` and `GET /api/scans/{id}/export/csv` endpoints in FastAPI.
  - Formatted scan history and detailed vulnerability findings into RFC 4180 compliant tabular CSV data.
  - Wired frontend download links in `ScanHistory.tsx` to directly trigger native browser downloads using the backend.
- **Outcome:** A human-readable data egress point was established, enabling security teams to export, filter, and audit vulnerabilities within spreadsheet applications like Excel.

## 📅 Day 22: Backend PDF Report Engine
**Date:** `05/08/2026` *(Today)*
- **Tasks:**
  - Installed and configured `fpdf2` in the Python backend to replace client-side PDF generation.
  - Developed `GET /api/scans/{id}/export/pdf` in FastAPI to dynamically render structured PDF reports from scan data.
  - Engineered a premium visual aesthetic for the PDF including dark-mode headers, severity color badges, and structured executive summaries.
  - Refactored `ScanHistory.tsx` and `Reports.tsx` UI components to trigger native backend PDF downloads.
- **Outcome:** RepoGuard now offers enterprise-grade, professional PDF compliance reports generated securely and performantly entirely on the backend.

## 📅 Day 23: Database Connection String Heuristics
**Date:** `06/08/2026` *(Today)*
- **Tasks:**
  - Upgraded the security scanner engine (`backend/scanner/plugins/regex.py`).
  - Added new `CRITICAL` severity heuristics to detect leaked connection URIs for MongoDB, PostgreSQL, MySQL, Redis, and AMQP.
  - Deployed dummy secrets (`test_db_secrets.py`) to successfully validate the end-to-end scanning and reporting flow.
- **Outcome:** RepoGuard is now capable of proactively detecting and blocking the deployment of high-risk exposed database credentials, further securing infrastructure.

## 📅 Day 24: Advanced AI Chat Interactivity
**Date:** `07/08/2026` *(Today)*
- **Tasks:**
  - Developed the `AIChatPanel.tsx` frontend component featuring a beautiful glassmorphic sliding interface with React Markdown and Prism syntax highlighting.
  - Implemented the `POST /api/chat` route on the FastAPI backend to seamlessly pass vulnerability context and conversation history to the Gemini AI API.
  - Wired the "Ask AI" buttons directly into the `SecretScanner` UI so developers can seamlessly transition from vulnerability discovery to interactive remediation.
  - Expanded Python static analysis heuristics targeting `debug=True`, `pickle.loads()`, `eval()`, and `subprocess` risks.
- **Outcome:** RepoGuard now offers an embedded, conversational AI Security Architect capable of holding context-aware dialogues to explain and remediate detected vulnerabilities.

---

### 🎯 Next Planned Milestones
- [x] Implement additional secret detection heuristics.
- [x] Complete professional end-to-end system wireup.
- [ ] Add AI Remediation directly into the frontend.
