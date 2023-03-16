import express from 'express';
import path from 'path';

import { Sigmoid } from '../../../lib/nn/activations';
import { MeanSquaredError } from '../../../lib/nn/error-functions';
import MNISTClassifier from '../../nns/mnist-classifier';
import { DataPair, MNISTLoader } from '../../utils/loader';

const router = express.Router();

const classifier = new MNISTClassifier(new MeanSquaredError(), 0.1);
classifier.addDenseLayer(784, new Sigmoid());
classifier.addDenseLayer(64, new Sigmoid());
classifier.addDenseLayer(10, new Sigmoid());

let trainDataLoaded = false;
let testDAtaLoaded = false;
let loader = new MNISTLoader(path.join(__dirname + './../../../../data'));
let trainData: Array<DataPair>;
let testData: Array<DataPair>;

router.post('/predict', (req, res) => {
  let input: Array<number> = req.body;
  if (input.length !== 784) {
    return res.status(415).json({err: "Input data should be of length 784."});
  }

  let prediction = classifier.predict(input);
  return res.status(200).json(prediction);
});

router.post('/train', async (req, res) => {
  let epochs: number = req.body.epochs;
  let learningRate: number = req.body.learningRate;

  if (!trainDataLoaded) {
    trainData = await loader.getDataArray('mnist_train.csv', 60000);
    trainDataLoaded = true;
  }

  let result = classifier.train(trainData, {
    epochs,
    learningRate
  });
  return res.status(200).json(result);
});

router.post('/test', async (req, res) => {
  let testLength: number = req.body.testLength;

  if (!testDAtaLoaded) {
    testData = await loader.getDataArray('mnist_test.csv', 10000);
    testDAtaLoaded = true;
  }

  let result = classifier.test(testData, {testLength});
  return res.status(200).json(result);
});

export default router;