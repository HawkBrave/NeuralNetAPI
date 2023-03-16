import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

import { ErrorHandler } from './api/errors/error-handler';
import mnistRouter from './api/routes/mnist';

dotenv.config();

const app = express();
const errHandler = new ErrorHandler();
const port = process.env.PORT || 6969;

app.use(express.json());

app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, '/index.html'));
});

app.use('/api/mnist', mnistRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});