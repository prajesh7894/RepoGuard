import { runScanOnRepo } from './src/utils/scanner.js';

async function main() {
  console.log('Starting scan...');
  const findings = await runScanOnRepo('https://github.com/OWASP/NodeGoat.git');
  console.log('Findings:', findings);
}

main().catch(console.error);
