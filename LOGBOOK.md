# RepoGuard - Daily Development Logbook

**Project Name:** RepoGuard (AI-Powered Security Posture Management)
**Developer:** Prajesh (GitHub: prajesh7894)
**Objective:** Build a full-stack, real-time security scanning platform that analyzes GitHub repositories for secrets, vulnerabilities, and misconfigurations.

---

## 📅 Date: 15/07/2026
**Phase:** Requirements Gathering & System Architecture Design
**Tasks Completed:**
- Defined the core problem statement: GitHub repositories often contain hardcoded secrets and basic vulnerabilities that go unnoticed.
- Drafted the system architecture: A React frontend communicating with a Node.js/Express backend, backed by an SQLite database.
- Selected the technology stack: React, TypeScript, Vite, Tailwind CSS, Prisma, Express, and LibSQL.
- Mapped out the primary user flows (Dashboard -> Connect Repo -> View Live Scan -> Analyze Report).

## 📅 Date: 16/07/2026
**Phase:** Project Initialization & Build System Setup
**Tasks Completed:**
- Initialized the Git repository and connected it to the remote GitHub origin.
- Bootstrapped the frontend using Vite with React and TypeScript.
- Configured ESLint and `tsconfig.json` for strict type-checking to ensure enterprise-level code quality.
- Set up the package manager and installed core dependencies (React Router, Lucide Icons, Recharts).

## 📅 Date: 17/07/2026
**Phase:** Frontend Foundation & Design System 
**Tasks Completed:**
- Configured Tailwind CSS with custom theme extensions.
- Developed a modern, dark-mode design system utilizing "glassmorphism" (translucent backgrounds, blurs) and neon accent colors.
- Built reusable CSS classes (`.glass-panel`, `.gradient-text`) in `index.css`.
- Designed the global layout shell to house the sidebar and main content area.

## 📅 Date: 18/07/2026
**Phase:** Core UI Components Implementation
**Tasks Completed:**
- Developed the `Sidebar.tsx` navigation component with active state handling.
- Built the global `Header.tsx` containing user profile mockups and breadcrumbs.
- Created reusable UI elements: `Tooltip.tsx` for hover information and a custom `ShaderBackground` for visual depth.
- Ensured all components are fully responsive for mobile and desktop viewports.

## 📅 Date: 19/07/2026
**Phase:** Frontend Prototyping & Mock Data Integration
**Tasks Completed:**
- Built the `Dashboard.tsx` layout and structured the layout for Recharts.
- Developed the `Repositories.tsx` page to list connected codebases.
- Created the `NewScan.tsx` wizard interface to simulate the user experience of starting a scan.
- Populated the UI with static mock data to validate the visual hierarchy and spacing before backend integration.

## 📅 Date: 20/07/2026
**Phase:** Backend Initialization & Database Schema Design
**Tasks Completed:**
- Initialized the Node.js backend environment in `server.ts`.
- Configured Prisma ORM to connect to a local LibSQL (SQLite) database file.
- Designed the relational schema in `schema.prisma`:
  - `Repository` model (tracks name, url, overall score, language).
  - `Scan` model (tracks critical issues, secrets, and stores the detailed JSON report).
- Generated Prisma client and ran the initial database migration.

## 📅 Date: 21/07/2026
**Phase:** Building the Physical Scanning Engine
**Tasks Completed:**
- Developed `src/utils/scanner.ts` to handle backend repository processing.
- Integrated `simple-git` to physically clone target repositories into a temporary local workspace (`/tmp_scans/`).
- Wrote a recursive file system traversal function to read all source code files within a cloned repository.
- Implemented cleanup routines to delete the temporary workspace after scanning to prevent storage leaks.

## 📅 Date: 22/07/2026
**Phase:** Implementing Security Heuristics (Regex Engine)
**Tasks Completed:**
- Defined `SECRET_PATTERNS`: Regular expressions to detect hardcoded AWS keys, Slack tokens, passwords, and private keys.
- Defined `VULN_PATTERNS`: Regular expressions to detect dangerous coding practices like `eval()`, `exec()`, and raw `innerHTML` assignments (XSS vectors).
- Integrated the pattern matching into the file traversal loop, generating a structured array of `Finding` objects containing the exact file path, line number, and severity.

## 📅 Date: 23/07/2026
**Phase:** Real-Time Log Streaming (SSE) & Persistence
**Tasks Completed:**
- Upgraded the `GET /api/scans/stream` endpoint to use Server-Sent Events (SSE).
- Connected the `NewScan.tsx` frontend to the SSE endpoint to stream live console logs to the user as the backend clones and scans the repo.
- Resolved a critical Vite HMR bug where the frontend server crashed upon detecting the cloned files.
- Implemented persistence: Backend now intercepts completed scans, upserts the `Repository`, and saves the final `Scan` to the SQLite database.

## 📅 Date: 24/07/2026
**Phase:** Dynamic Dashboard & Data Visualization
**Tasks Completed:**
- Removed all hardcoded statistics from `Dashboard.tsx`.
- Implemented dynamic calculation logic to sum total critical issues, high risks, and secrets from the database.
- Engineered a `useMemo` algorithm to group historical scans by day-of-the-week to render an accurate 7-day trailing line chart.
- Replaced CSS pie charts with dynamic `Recharts` Pie components that accurately distribute the total risk metrics.

---

## 📅 Date: 25/07/2026
**Phase:** AI Model Integration Strategy
**Tasks Completed:**
- Set up API keys and environment variables for the Google Gemini LLM securely using `.env`.
- Drafted prompt engineering instructions to force the LLM to output structured JSON security reviews.
- Designed the backend endpoint `/api/ai-review` to handle incoming code snippets and communicate with the Gemini API.

## 📅 Date: 26/07/2026
**Phase:** Real AI Code Review Implementation & Database Preparation
**Tasks Completed:**
- Replaced the mock delay in the "AI Security Review" tab with live API calls to Gemini.
- Upgraded the system to use the advanced `gemini-3.5-flash` model for high-speed, accurate code analysis.
- Parsed the LLM JSON response and dynamically rendered it in the glassmorphism UI, displaying exact logic flaws and precise code fixes.
- Created database models in Prisma for `User` and `Session`.
- Pushed schema changes to the local SQLite database to initialize the tables.

## 📅 Date: 27/07/2026 - Phase 1: Authentication & User Accounts
**Tasks Completed:**
- Implemented backend API endpoints for user registration (`POST /api/register`).
- Integrated `bcryptjs` for secure password hashing.

## 📅 Date: 28/07/2026 - Phase 1: Authentication & User Accounts
**Tasks Completed:**
- Implemented backend API endpoint for JWT-based user login (`POST /api/login`).
- Added token generation using `jsonwebtoken` and created `Session` records in the database.

## 📅 Date: 30/07/2026 *(Planned)*
- Add JWT token storage and management in the React frontend.

## 📅 Date: 31/07/2026 *(Planned)*
- Implement Frontend Protected Routes (redirect unauthenticated users to login).

## 📅 Date: 01/08/2026 *(Planned)*
- Secure backend API routes with an Auth Middleware.

## 📅 Date: 02/08/2026 *(Planned)* - Phase 2: PDF Reporting & Export System
- Add "Export Data" buttons and dropdown UI to the Scan History page.

## 📅 Date: 03/08/2026 *(Planned)*
- Create a backend endpoint to export a specific scan as raw JSON.

## 📅 Date: 04/08/2026 *(Planned)*
- Create a backend endpoint to export scan findings as a CSV file.

## 📅 Date: 05/08/2026 *(Planned)*
- Implement PDF generation logic on the backend for formal reports.

## 📅 Date: 06/08/2026 *(Planned)*
- Wire frontend buttons to download the generated PDF and CSV files.

## 📅 Date: 07/08/2026 *(Planned)* - Phase 3: Scanner Expansion & Heuristics
- Add Regex rules for detecting hardcoded database connection strings.

## 📅 Date: 08/08/2026 *(Planned)*
- Add Regex rules specific to Python (e.g., detecting Flask `debug=True`, unsafe `pickle` usage).

## 📅 Date: 09/08/2026 *(Planned)*
- Add Regex rules specific to PHP (e.g., unsafe `$_GET` or `eval()` patterns).

## 📅 Date: 10/08/2026 *(Planned)*
- Implement logic to detect and flag outdated-looking dependency files (`package.json`, `requirements.txt`).

## 📅 Date: 11/08/2026 *(Planned)*
- Add a "Severity Level" filtering dropdown to the UI to sort findings.

## 📅 Date: 12/08/2026 *(Planned)*
- Add a "Language" filtering dropdown to the Dashboard UI.

## 📅 Date: 13/08/2026 *(Planned)*
- Update database Schema to track "Resolved" vs "Open" vulnerabilities.

## 📅 Date: 14/08/2026 *(Planned)* - Phase 4: Notifications & UI Polish
- Build a Notification bell icon and dropdown panel in the top Header.

## 📅 Date: 15/08/2026 *(Planned)*
- Update backend to generate "Notification" records upon scan completion.

## 📅 Date: 16/08/2026 *(Planned)*
- Wire notifications to the frontend (show a red dot when a scan finishes).

## 📅 Date: 17/08/2026 *(Planned)*
- Add pagination controls (Page 1, 2, 3) to the Scan History table.

## 📅 Date: 18/08/2026 *(Planned)*
- Implement backend logic to limit table queries using Prisma `skip` and `take`.

## 📅 Date: 19/08/2026 *(Planned)*
- Add a custom designed "404 Not Found" page for invalid URL routing.

## 📅 Date: 20/08/2026 *(Planned)*
- Polish mobile responsiveness across the entire dashboard.

## 📅 Date: 21/08/2026 *(Planned)* - Phase 5: Advanced AI Interactivity
- Design a "Chat with AI" UI panel inside individual scan reports.

## 📅 Date: 22/08/2026 *(Planned)*
- Implement backend chat history memory using the Gemini API.

## 📅 Date: 23/08/2026 *(Planned)*
- Wire frontend chat input to the new memory-enabled AI endpoint.

## 📅 Date: 24/08/2026 *(Planned)*
- Improve prompt engineering to ensure the AI speaks like a security auditor.

## 📅 Date: 25/08/2026 *(Planned)*
- Add syntax highlighting to the code blocks returned by the AI in chat.

## 📅 Date: 26/08/2026 *(Planned)* - Phase 6: Settings & Configurations
- Create a comprehensive Settings page UI (Profile management).

## 📅 Date: 27/08/2026 *(Planned)*
- Implement feature to allow users to input and securely save their own Gemini API Key in the UI.

## 📅 Date: 28/08/2026 *(Planned)*
- Build a mock UI for configuring "GitHub Webhooks" to simulate automated scanning on push.

## 📅 Date: 29/08/2026 *(Planned)* - Phase 7: Final Delivery & Polish
- Database optimization: Add database indexes to Prisma to speed up queries.

## 📅 Date: 30/08/2026 *(Planned)*
- Write a highly professional `README.md` with badges, setup instructions, and screenshots for GitHub.

## 📅 Date: 31/08/2026 *(Planned)*
- **(Final Day)** Complete end-to-end bug sweep, format codebase, prepare the final presentation notes and finalize `LOGBOOK.md`.
