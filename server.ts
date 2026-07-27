import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { runScanOnRepo } from "./src/utils/scanner.js";

const prisma = new PrismaClient();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
            ...history.map((msg: any) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            })),
            { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: "You are a highly capable AI Security Assistant for RepoGuard. Your goal is to help users understand their vulnerabilities, recommend fixes, and provide secure coding practices."
        }
      });
      
      res.json({ response: response.text });
    } catch (error: any) {
      console.error('Error generating AI response:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  app.post("/api/ai-review", async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) return res.status(400).json({ error: 'Code is required' });

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are an expert Secure Code Reviewer. Analyze the following code snippet for logic flaws, injection vectors, and security vulnerabilities.
Return ONLY a valid JSON object with a single "vulns" array. Each object in the array must have:
- title: A short, descriptive title of the vulnerability.
- severity: "critical", "high", "medium", or "low".
- line: The approximate line number where the issue exists (number).
- description: A clear explanation of the vulnerability and its impact.
- recommendation: A short sentence on how to fix it.
- fixedCode: The complete, corrected version of the code snippet that resolves the issue.

Do NOT wrap the JSON in Markdown backticks or any other formatting. Output ONLY the raw JSON string.

Code to analyze:
\`\`\`
${code}
\`\`\`
`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      });
      
      let rawText = response.text || "{}";
      rawText = rawText.replace(/^```json/i, '').replace(/```$/i, '').trim();
      
      const parsed = JSON.parse(rawText);
      res.json(parsed);
    } catch (error: any) {
      console.error('Error generating AI Review:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });


  // --- Authentication Routes ---
  app.post("/api/register", async (req, res) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name
        }
      });

      res.status(201).json({ message: "User registered successfully", userId: user.id });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // --- Prisma API Routes ---

  app.get("/api/repos", async (req, res) => {
    try {
      const repos = await prisma.repository.findMany({
        include: {
          scans: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { updatedAt: 'desc' }
      });
      
      // Transform data to match frontend expectations
      const formattedRepos = repos.map(repo => {
        const latestScan = repo.scans[0];
        return {
          id: repo.id,
          name: repo.name,
          lang: repo.lang,
          status: repo.status,
          score: repo.score,
          scoreColor: repo.scoreColor,
          isScanning: repo.isScanning,
          visibility: repo.visibility,
          createdAt: repo.createdAt,
          findings: latestScan ? {
            crit: latestScan.critical,
            high: latestScan.high,
            secrets: latestScan.secrets,
            detail: latestScan.findingsDetail ? JSON.parse(latestScan.findingsDetail) : []
          } : { crit: 0, high: 0, secrets: 0, detail: [] }
        };
      });
      
      res.json(formattedRepos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch repositories" });
    }
  });

  app.get("/api/repos/:id", async (req, res) => {
    try {
      const repo = await prisma.repository.findUnique({
        where: { id: parseInt(req.params.id) },
        include: { scans: { orderBy: { createdAt: 'desc' } } }
      });
      if (!repo) return res.status(404).json({ error: "Repository not found" });
      res.json(repo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch repository" });
    }
  });

  app.post("/api/repos", async (req, res) => {
    try {
      const { name, url, lang, visibility } = req.body;
      const newRepo = await prisma.repository.create({
        data: {
          name,
          url,
          lang: lang || 'Unknown',
          visibility: visibility || 'Private',
          status: 'Excellent', // Default new repo status
          score: 100,
          scoreColor: 'green-400',
          isScanning: false,
        }
      });
      res.json(newRepo);
    } catch (error) {
      res.status(500).json({ error: "Failed to create repository" });
    }
  });

  app.get("/api/scans", async (req, res) => {
    try {
      const scans = await prisma.scan.findMany({
        include: { repository: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20
      });
      res.json(scans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch scans" });
    }
  });

  app.post("/api/scans", async (req, res) => {
    try {
      const { repoId } = req.body;
      
      const repo = await prisma.repository.findUnique({ where: { id: parseInt(repoId) }});
      if (!repo || !repo.url) {
        return res.status(400).json({ error: "Repository or repository URL not found" });
      }

      // Simulate setting repo to scanning state
      await prisma.repository.update({
        where: { id: parseInt(repoId) },
        data: { isScanning: true }
      });

      // Run scan asynchronously
      setTimeout(async () => {
        try {
          const findings = await runScanOnRepo(repo.url!);
          
          const crit = findings.filter(f => f.severity === 'CRITICAL' && f.type === 'VULNERABILITY').length;
          const high = findings.filter(f => f.severity === 'HIGH' && f.type === 'VULNERABILITY').length;
          const secrets = findings.filter(f => f.type === 'SECRET').length;
          
          let status = 'Excellent';
          let score = 100 - (crit * 15) - (high * 5) - (secrets * 20);
          let scoreColor = 'green-400';
          
          if (score < 50) {
            status = 'Critical';
            scoreColor = 'red-500';
          } else if (score < 80) {
            status = 'Fair';
            scoreColor = 'yellow-500';
          }

          if (score < 0) score = 0;

          await prisma.scan.create({
            data: {
              repoId: parseInt(repoId),
              critical: crit,
              high: high,
              secrets: secrets,
              status: 'completed',
              findingsDetail: JSON.stringify(findings)
            }
          });

          await prisma.repository.update({
            where: { id: parseInt(repoId) },
            data: { 
              isScanning: false,
              score,
              status,
              scoreColor
            }
          });
        } catch (scanErr) {
          console.error("Scan failed internally:", scanErr);
          await prisma.repository.update({
            where: { id: parseInt(repoId) },
            data: { isScanning: false }
          });
        }
      }, 0);

      res.json({ message: "Scan started" });
    } catch (error) {
      res.status(500).json({ error: "Failed to start scan" });
    }
  });

  app.get("/api/scans/stream", async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: "Repository URL required" });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendLog = (msg: string) => {
      res.write(`data: ${JSON.stringify({ type: 'log', message: msg })}\n\n`);
    };

    try {
      // Run the scan with our custom onLog callback
      const findings = await runScanOnRepo(url, (msg) => {
        sendLog(msg);
      });
      
      // Calculate final score
      const crit = findings.filter(f => f.severity === 'CRITICAL' && f.type === 'VULNERABILITY').length;
      const high = findings.filter(f => f.severity === 'HIGH' && f.type === 'VULNERABILITY').length;
      const secrets = findings.filter(f => f.type === 'SECRET').length;
      
      let status = 'Excellent';
      let scoreColor = 'green-400';
      let score = 100 - (crit * 15) - (high * 5) - (secrets * 20);
      
      if (score < 50) {
        status = 'Critical';
        scoreColor = 'red-500';
      } else if (score < 80) {
        status = 'Fair';
        scoreColor = 'yellow-500';
      }
      if (score < 0) score = 0;

      // Extract repo name from URL
      const repoName = url.replace('https://github.com/', '').replace('.git', '');

      // Upsert Repository
      let repo = await prisma.repository.findFirst({ where: { url } });
      if (!repo) {
        repo = await prisma.repository.create({
          data: {
            name: repoName,
            url,
            lang: 'Unknown',
            visibility: 'Public',
            status,
            score,
            scoreColor,
            isScanning: false,
          }
        });
      } else {
        repo = await prisma.repository.update({
          where: { id: repo.id },
          data: { status, score, scoreColor, isScanning: false }
        });
      }

      // Create Scan record
      await prisma.scan.create({
        data: {
          repoId: repo.id,
          critical: crit,
          high: high,
          secrets: secrets,
          status: 'completed',
          findingsDetail: JSON.stringify(findings)
        }
      });
      
      res.write(`data: ${JSON.stringify({ type: 'done', findings, score, status })}\n\n`);
      res.end();
    } catch (err: any) {
      sendLog(`[ERROR] Internal scanner failed: ${err.message}`);
      res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
      res.end();
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
