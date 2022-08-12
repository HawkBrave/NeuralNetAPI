import Classifier from "../../lib/nn/classifier";
import { ErrorFunction } from "../../lib/nn/error-functions";
import { DataPair } from "../utils/loader";

export type Prediction = {
  answer: number;
  confidence: number;
  groundTruth: number | null;
  answerIsRight: boolean | null;
};

export type TrainResults = {
  totalTrained: number;
  status: string;
  timeElapsedInSeconds: number;
};

export type TestResults = {
  totalTested: number;
  totalCorrectAnswers: number;
  totalWrongAnswers: number;
  accuracy: number;
};

export default class MNISTClassifier extends Classifier {

  predict(input: Array<number> | DataPair): Prediction {
    let arrInput: Array<number>;
    let groundTruth: number | null = null;

    if (input instanceof Array) {
      arrInput = <Array<number>> input;
    } else {
      arrInput = (<DataPair> input).x;
      groundTruth = (<DataPair> input).y;
    }
    let pred = this.forward(arrInput);
    let maxIndex = pred.getMaxValIndex().i;
    let confidence = pred.get({i: maxIndex, j: 0}) * 100;

    let answer = maxIndex;
    let answerIsRight = null;
    if (groundTruth) {
      answerIsRight = maxIndex === groundTruth;
    }

    return {
      answer,
      confidence,
      groundTruth,
      answerIsRight
    };
  }

  train(data: Array<DataPair>, options?: {
    trainLength?: number, 
    learningRate?: number,
    errorFunction?: ErrorFunction
  }): TrainResults {
    let trainLength = options?.trainLength ?? data.length;
    if (trainLength > data.length) {
      throw new Error('Training length cannot be larger than length of the train dataset.');
    }
    this.learningRate = options?.learningRate ?? this.learningRate;
    this.errorFunction = options?.errorFunction ?? this.errorFunction;

    let trainInputs: Array<Array<number>> = [];
    let trainTargets: Array<Array<number>> = [];
    for (let i = 0; i < trainLength; i++) {
      let targetVec = new Array(10).fill(0);
      targetVec[data[i].y] = 1;

      trainTargets.push(targetVec);
      trainInputs.push(data[i].x);
    }

    let startTime = new Date().getTime();
    this.backward(trainInputs, trainTargets);
    let timeElapsed = new Date().getTime() - startTime;

    return {
      totalTrained: trainLength,
      status: 'Done',
      timeElapsedInSeconds: timeElapsed / 1000
    };
  }

  test(data: Array<DataPair>, options?: {
    testLength?: number
  }): TestResults {
    let testLength = options?.testLength ?? data.length;
    if (testLength > data.length) {
      throw new Error('Test length cannot be larger than length of the test dataset.');
    }

    let predictions: Array<boolean> = [];
    for (let i = 0; i < data.length; i++) {
      let prediction = this.predict(data[i]);
      predictions.push(<boolean> prediction.answerIsRight);
    }

    let totalCorrectAnswers = predictions.filter(el => el).length;
    let totalWrongAnswers = predictions.length - totalCorrectAnswers;
    let accuracy = 100 * totalCorrectAnswers / predictions.length;

    return {
      totalTested: testLength,
      totalCorrectAnswers,
      totalWrongAnswers,
      accuracy
    };
  }
}