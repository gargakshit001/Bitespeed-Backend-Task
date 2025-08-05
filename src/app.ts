import express from 'express';
import bodyParser from 'body-parser';
import prisma from './config/prisma';
import { identify } from './controllers/identify';

const app = express();
const PORT = 3000;


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})

app.use(bodyParser.json());
app.post('/identify', identify);

// shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
