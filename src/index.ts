import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

import { ErrorHandler } from './api/errors/error-handler';

import { DataPair, MNISTLoader } from './utils/loader';
import { ErrorFunction, MeanSquaredError } from '../lib/nn/error-functions';
import { Sigmoid } from '../lib/nn/activations';
import { MatrixMath } from '../lib/mat/matrix';
import MNISTClassifier from './nns/mnist-classifier';

dotenv.config();

const app = express();
const errHandler = new ErrorHandler();
const port = process.env.PORT;

const classifier = new MNISTClassifier(new MeanSquaredError(), 0.1);
classifier.addDenseLayer(784, new Sigmoid());
classifier.addDenseLayer(64, new Sigmoid());
classifier.addDenseLayer(10, new Sigmoid());

app.set("train-data-loaded", false);
app.set("test-data-loaded", false);
let loader = new MNISTLoader(path.join(__dirname + './../data'));
let trainData: Array<DataPair>;
let testData: Array<DataPair>;

app.use(express.json());

app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/predict', (req, res) => {
  let input: Array<number> = req.body;
  if (input.length !== 784) {
    return res.status(415).json({err: "Input data should be of length 784."});
  }

  let prediction = classifier.predict(input);
  return res.status(200).json(prediction);
});

app.post('/train', async (req, res) => {
  let trainLength: number = req.body.trainLength;
  let learningRate: number = req.body.learningRate;

  if (!app.get("train-data-loaded")) {
    trainData = await loader.getDataArray('mnist_train.csv', 60000);
    app.set("train-data-loaded", true);
  }

  let result = classifier.train(trainData, {
    trainLength,
    learningRate
  });
  return res.status(200).json(result);
});

app.post('/test', async (req, res) => {
  let testLength: number = req.body.testLength;

  if (!app.get("test-data-loaded")) {
    testData = await loader.getDataArray('mnist_test.csv', 10000);
    app.set("test-data-loaded", true);
  }

  let result = classifier.test(testData, {testLength});
  return res.status(200).json(result);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});