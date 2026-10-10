# RepoGuard - Enterprise Security Posture Management
**Diploma Final Year Project Submission**

## 🚀 Project Overview
RepoGuard is a modular, AI-powered Continuous Security Posture Management (CSPM) and code analysis platform. It simulates an enterprise-grade dashboard that autonomously scans Git repositories for vulnerabilities, exposed secrets, and misconfigurations.

## ✨ Key Features Implemented
1. **Interactive Dependency Graph:** A high-performance WebGL node graph (`@xyflow/react`) mapping out vulnerable package trees.
2. **AI Security Review Engine:** Integrates with Gemini LLM to automatically perform static analysis (SAST) and suggest Pull Request code remediations.
3. **Immutable SOC2 Audit Logs:** A completely tamper-proof compliance ledger tracking every user action across the platform.
4. **Live Executive Reporting:** Dynamically generates downloadable PDF and CSV compliance reports (`fpdf2` & `io`).
5. **Custom Rules Engine:** A platform allowing security engineers to define proprietary regex rules to block unauthorized patterns.
6. **Live Jira & Slack Integrations:** Webhook integrations for instant incident alerting.
7. **Real-time SSE Streaming:** Uses Server-Sent Events to stream scan logs directly to the frontend in real-time.

## 🛠️ Tech Stack
- **Frontend:** React 18, Vite, TailwindCSS v4, Framer Motion, Lucide React, Recharts (Data Visualization).
- **Backend:** Python 3.10+, FastAPI, SQLAlchemy, Uvicorn, SQLite.
- **AI / Security:** Google Gemini LLM API, regex-based entropy scanning.

## 🖥️ How to Run the Project Locally

### 1. Start the Backend Server (Terminal 1)
\`\`\`powershell
cd backend
.\venv\Scripts\activate
uvicorn main:app --host 127.0.0.1 --port 8000
\`\`\`

### 2. Start the Frontend Server (Terminal 2)
\`\`\`powershell
npm install
npm run dev
\`\`\`
*The application will be accessible at http://localhost:5173*

## 📚 Evaluation Notes
- The UI features a custom Glassmorphism design system built from scratch with Tailwind.
- The `app.db` SQLite database is pre-configured and automatically handles migrations via SQLAlchemy.
- Mock mode is supported for OAuth: clicking "Connect to GitHub" falls back to a simulated sync if API limits are reached.
