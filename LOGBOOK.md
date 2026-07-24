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

## 📅 Date: 25/07/2026 *(Planned)*
**Phase:** AI Model Integration Strategy
**Tasks Planned:**
- Set up API keys and environment variables for the Google Gemini LLM.
- Design the context window strategy for passing source code snippets to the LLM without exceeding token limits.
- Draft prompt engineering instructions to force the LLM to output structured JSON security reviews.

## 📅 Date: 26/07/2026 *(Planned)*
**Phase:** Real AI Code Review Implementation
**Tasks Planned:**
- Replace the regex-based "AI Security Review" tab with live API calls to Gemini.
- Parse the LLM response and render it in a readable, actionable format for the user, suggesting precise code fixes.

## 📅 Date: 27/07/2026 *(Planned)*
**Phase:** Final Polish & Project Submission Prep
**Tasks Planned:**
- Conduct end-to-end bug testing.
- Optimize frontend bundle sizes and database query performance.
- Finalize documentation, README, and prepare the project presentation for college submission.
