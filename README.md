<div align="center">
  <img src="banner.jpg" alt="RepoGuard Banner" width="100%">
</div>

<h1 align="center">🛡️ RepoGuard</h1>

<p align="center">
  <strong>Next-Generation AI-Powered Security Posture Management for GitHub</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/AI-Google_Gemini-FF4F8B?logo=google&logoColor=white" alt="Google Gemini AI">
  <img src="https://img.shields.io/badge/Maintained%3F-Yes-success.svg" alt="Maintained">
</p>

<br />

> **RepoGuard** is an enterprise-grade full-stack security platform. It dynamically scans your GitHub repositories in real-time, detecting hardcoded secrets, misconfigurations, and severe code vulnerabilities. Integrated with **Google Gemini AI**, it doesn't just find issues—it explains them and provides exact code fixes.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🤖 **AI Security Review** | Deep-dive code analysis powered by the advanced `gemini-3.5-flash` model. |
| ⚡ **Real-Time Streaming** | Server-Sent Events (SSE) stream the terminal logs to the frontend as your repo is cloned and scanned. |
| 📊 **Dynamic Dashboard** | Beautiful glassmorphism UI built with Tailwind CSS, featuring interactive Recharts. |
| 🛡️ **Vulnerability Triage** | Manage your findings efficiently by marking false positives or accepting risks to update your security score instantly. |
| 🔔 **Notification Center** | Stay updated with a real-time notification bell for background scans and alerts. |
| 💾 **SQLite Persistence** | Fast, local, serverless database utilizing Prisma ORM and LibSQL. |
| 🔒 **Secret Detection** | High-performance regex engine catches AWS keys, Slack tokens, and private keys. |

<br />

## 🚀 1-Minute Quickstart

Want to run RepoGuard locally? Follow these 3 simple commands:

```bash
# 1. Clone the repository
git clone https://github.com/prajesh7894/RepoGuard.git
cd RepoGuard

# 2. Install all dependencies
npm install

# 3. Start the application (Frontend + Backend)
npm run dev
```

> **Note:** Ensure you create a `.env` file in the root directory and add your `GEMINI_API_KEY` for the AI features to work.

<br />

## 🎨 Stunning UI (Glassmorphism)

Our dashboard utilizes a cutting-edge dark mode design system, featuring translucent backgrounds, blurs, and neon accent colors tailored for security professionals. 

*(Screenshots coming soon!)*

<br />

## 📖 The Developer Logbook

This project was built day-by-day to demonstrate a professional engineering workflow. Check out the [LOGBOOK.md](./LOGBOOK.md) to see exactly how this architecture was designed, prototyped, and implemented from scratch.

<br />

## 🤝 Contributing

We welcome community contributions! Please check back soon for our official `CONTRIBUTING.md` guidelines. If you find a bug, feel free to open an issue or submit a Pull Request.

---

<div align="center">
  Built with ❤️ by <a href="https://github.com/prajesh7894">Prajesh</a>
</div>
