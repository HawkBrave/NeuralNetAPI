import { ActivationFunction } from "./activations";
import { ErrorFunction } from "./error-functions";
import { Layer } from "./layer";
import { Matrix, MatrixMath } from "./matrix";

export default class Classifier {
  errorFunction: ErrorFunction;
  learningRate: number;  
  layers: Array<Layer>;
  count: number;

  constructor(errorFunction: ErrorFunction, learningRate: number) {
    this.errorFunction = errorFunction;
    this.learningRate = learningRate;
    this.layers = new Array();
    this.count = 0;
  }

  addDenseLayer(nodes: number, activationFunction: ActivationFunction) {
    let layer = new Layer(this.count++, nodes, activationFunction);

    if (this.layers.length >= 1) {
      let prev: Layer = this.layers[this.layers.length - 1];
      prev.weights = Matrix.random(layer.nodes, prev.nodes);
      layer.bias = Matrix.random(layer.nodes);
    }

    this.layers.push(layer);
  }

  // input is a vector (784, 1), output is a vector (10, 1)
  forward(input: Matrix | Array<number>): Matrix {
    let output: Matrix;

    if (input instanceof Matrix) {
      output = input.copy();
    } else {
      output = Matrix.from(input);
    }

    for (let i = 0; i < this.layers.length - 1; i++) {
      let layer = this.layers[i];
      let nextLayer = this.layers[i+1];

      output = layer.propagate(output);
      output.addInplace(<Matrix> nextLayer.bias);
      output.map(nextLayer.activationFunction.f);
    }

    return output;
  }

  backward(inputs: Matrix | Array<Array<number>>, targets: Matrix | Array<Array<number>>) {
    if (!(inputs instanceof Matrix && targets instanceof Matrix)) {
      if ((<Array<any>> inputs).length !== (<Array<any>> targets).length) {
        throw new Error("Length of inputs must be equal to length of targets");
      }
    }

    //let totalErr = new Matrix(this.layers[this.layers.length - 1].nodes, 1);

    // loop for every hand-written digit data
    console.log('');
    for (let i = 0; i < (<Array<any>> inputs).length; i++) {
      process.stdout.write(`Epoch: ${i+1}\r`);

      let x = (<Array<any>> inputs)[i];
      let y = Matrix.from((<Array<any>> targets)[i]);

      let prediction = this.forward(x).copy();

      let loss = this.errorFunction.calculateFrom(y, prediction);
      //totalErr.addInplace(loss);

      // propagate the loss backward from outer layer
      for (let j = this.layers.length - 2; j >= 0; j--) {
        let layer = this.layers[j];
        let nextLayer = this.layers[j+1];

        // first iter: (10, 1)
        let hiddenLayerLoss = loss.copy();

        // first iter: (10, 1)
        let gradient = nextLayer.lastPropagatedInput.copy().map(nextLayer.activationFunction.df);
        
        gradient.scaleInplace(hiddenLayerLoss);
        gradient.scaleInplace(this.learningRate);

        // deltas are state of the 
        let deltas = MatrixMath.dot(gradient, MatrixMath.transpose(layer.lastPropagatedInput));
        
        layer.weights?.addInplace(deltas);
        nextLayer.bias?.addInplace(gradient);

        // (64, 1) after first iter
        loss = MatrixMath.dot(MatrixMath.transpose(<Matrix> layer.weights), loss);
      }
    }
    console.log();
  }
}