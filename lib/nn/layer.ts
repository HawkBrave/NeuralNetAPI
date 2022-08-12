import { ActivationFunction } from './activations';
import { Matrix, MatrixMath } from '../mat/matrix';

export class Layer {
  private _id: number;
  nodes: number;
  activationFunction: ActivationFunction;
  // inputs received by previous layer
  lastPropagatedInput: Matrix;
  weights: Matrix | null;
  bias: Matrix | null;

  constructor(id: number, nodes: number, activationFunction: ActivationFunction) {
    this._id = id;
    this.nodes = nodes;
    this.activationFunction = activationFunction;
    this.lastPropagatedInput = new Matrix(nodes);
    this.weights = null;
    this.bias = null;
  }

  propagate(input: Matrix) {
    if (input.shape.rows != this.lastPropagatedInput.shape.rows) {
      throw new Error(`[Layer${this._id}]: Cannot propagate input of shape {${input.shape.rows}, ${input.shape.cols}}. Input rows must match layer node count of ${this.nodes}.`);
    }
    
    if (this.weights == null) {
      throw new Error(`[Layer${this._id}]: Cannot propagate because of uninitialized weights.`);
    }

    this.lastPropagatedInput = input;
    return MatrixMath.dot(<Matrix> this.weights, input);
  }
}