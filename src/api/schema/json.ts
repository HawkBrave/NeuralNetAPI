export interface Prediction {
  answer: number;
  confidence: number;
  groundTruth: number | null;
  answerIsRight: boolean | null;
};

export interface TrainResults {
  totalTrained: number;
  status: string;
  timeElapsedInSeconds: number;
};

export interface TestResults {
  totalTested: number;
  totalCorrectAnswers: number;
  totalWrongAnswers: number;
  accuracy: number;
};
