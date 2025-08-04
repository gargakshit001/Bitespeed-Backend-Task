import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// clean up prisma connection on shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;