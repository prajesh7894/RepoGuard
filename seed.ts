import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.repository.create({
    data: {
      name: 'api-gateway-core',
      lang: 'Java',
      status: 'Critical',
      score: 45,
      scoreColor: 'red-500',
      isScanning: false,
      scans: {
        create: [
          {
            critical: 1,
            high: 12,
            secrets: 3,
            status: 'completed'
          }
        ]
      }
    }
  });

  await prisma.repository.create({
    data: {
      name: 'frontend-dashboard-v2',
      lang: 'TypeScript',
      status: 'Excellent',
      score: 98,
      scoreColor: 'green-400',
      isScanning: true,
      scans: {
        create: [
          {
            critical: 0,
            high: 0,
            secrets: 0,
            status: 'completed'
          }
        ]
      }
    }
  });

  await prisma.repository.create({
    data: {
      name: 'auth-service-node',
      lang: 'Node.js',
      status: 'Fair',
      score: 72,
      scoreColor: 'yellow-500',
      isScanning: false,
      scans: {
        create: [
          {
            critical: 0,
            high: 4,
            secrets: 0,
            status: 'completed'
          }
        ]
      }
    }
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
