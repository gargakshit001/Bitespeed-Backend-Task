import express from 'express';
import bodyParser from 'body-parser';
import prisma from './config/prisma';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})

// shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
