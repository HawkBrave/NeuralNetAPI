import { Matrix, MatrixMath } from '../mat/matrix';

export interface ErrorFunction {
  calculateFrom: (target: Matrix, prediction: Matrix) => Matrix;
}

export class MeanSquaredError implements ErrorFunction {
  calculateFrom = (target: Matrix, prediction: Matrix) => MatrixMath.subtract(target, prediction);
}