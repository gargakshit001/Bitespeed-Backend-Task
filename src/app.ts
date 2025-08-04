import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})

// shutdown
process.on('SIGINT', async () => {
  process.exit(0);
});
