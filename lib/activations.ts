export interface ActivationFunction {
  f(x: number): number;
  df(x: number): number;
}

export class Sigmoid implements ActivationFunction {
  f = (x: number) => 1 / (1 + Math.exp(-x));
  df = (x: number) => x * (1 - x);
}

export class Tanh implements ActivationFunction {
  f = (x: number) => Math.tanh(x);
  df = (x: number) => 1 - Math.pow(x, 2);
}