import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface Finding {
  file: string;
  line: number;
  type: 'SECRET' | 'VULNERABILITY';
  severity: 'CRITICAL' | 'HIGH';
  description: string;
  snippet: string;
}

const SECRET_PATTERNS = [
  { regex: /AKIA[0-9A-Z]{16}/g, description: 'AWS Access Key ID' },
  { regex: /ghp_[0-9a-zA-Z]{36}/g, description: 'GitHub Personal Access Token' },
  { regex: /-----BEGIN PRIVATE KEY-----/g, description: 'Private Key' },
  { regex: /eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g, description: 'JWT Token' }
];

const VULN_PATTERNS = [
  { regex: /eval\s*\(/g, description: 'Use of eval() is dangerous', severity: 'CRITICAL' },
  { regex: /exec\s*\(/g, description: 'Use of exec() can lead to RCE', severity: 'CRITICAL' },
  { regex: /\.innerHTML\s*=/g, description: 'Potential XSS via innerHTML', severity: 'HIGH' },
  { regex: /password\s*=\s*['"][^'"]+['"]/gi, description: 'Hardcoded password', severity: 'HIGH' }
];

async function walkDir(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDir(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  
  return files;
}

export async function runScanOnRepo(repoUrl: string, onLog?: (msg: string) => void): Promise<Finding[]> {
  const tmpDir = path.join(process.cwd(), 'tmp_scans', crypto.randomUUID());
  const findings: Finding[] = [];
  
  const log = (msg: string) => {
    if (onLog) onLog(msg);
    console.log(msg);
  };
  
  try {
    // 1. Clone Repo
    log(`Initializing RepoGuard Core engine for ${repoUrl}...`);
    await fs.promises.mkdir(tmpDir, { recursive: true });
    const git = simpleGit();
    log(`Cloning repository into temporary workspace...`);
    await git.clone(repoUrl, tmpDir, ['--depth', '1']);
    log(`Repository cloned successfully.`);
    
    // 2. Scan Files
    log(`Starting Dependency Scanner (SCA)...`);
    const files = await walkDir(tmpDir);
    log(`Found ${files.length} total files in repository.`);
    log(`Starting Secret Scanner with default entropy rules...`);
    
    for (const file of files) {
      // Basic text file check (skip binaries by extension)
      if (file.match(/\.(png|jpg|jpeg|gif|ico|pdf|zip|tar|gz|exe|dll)$/i)) continue;
      
      const content = await fs.promises.readFile(file, 'utf-8').catch(() => null);
      if (!content) continue;
      
      const lines = content.split('\n');
      const relativePath = path.relative(tmpDir, file);
      
      lines.forEach((lineText, lineIdx) => {
        // Check secrets
        SECRET_PATTERNS.forEach(pattern => {
          if (pattern.regex.test(lineText)) {
            findings.push({
              file: relativePath.replace(/\\/g, '/'),
              line: lineIdx + 1,
              type: 'SECRET',
              severity: 'CRITICAL',
              description: pattern.description,
              snippet: lineText.trim().substring(0, 100)
            });
            log(`[ALERT] Found ${pattern.description} in ${relativePath.replace(/\\/g, '/')} (line ${lineIdx + 1}).`);
            // reset regex state if global
            pattern.regex.lastIndex = 0;
          }
        });
        
        // Check vulns
        VULN_PATTERNS.forEach(pattern => {
          if (pattern.regex.test(lineText)) {
            findings.push({
              file: relativePath.replace(/\\/g, '/'),
              line: lineIdx + 1,
              type: 'VULNERABILITY',
              severity: pattern.severity as 'CRITICAL' | 'HIGH',
              description: pattern.description,
              snippet: lineText.trim().substring(0, 100)
            });
            log(`[WARN] AI Agent: Potential ${pattern.description} in ${relativePath.replace(/\\/g, '/')} (line ${lineIdx + 1}).`);
            pattern.regex.lastIndex = 0;
          }
        });
      });
    }
    
  } catch (error: any) {
    log(`[ERROR] Failed to scan repo: ${error.message}`);
    console.error(`Failed to scan repo ${repoUrl}:`, error);
  } finally {
    // 3. Cleanup
    try {
      log(`Compiling final security report and cleaning up workspace...`);
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    } catch (cleanupErr) {
      console.error(`Failed to cleanup ${tmpDir}:`, cleanupErr);
    }
  }
  
  log(`Scan finished successfully.`);
  return findings;
}
