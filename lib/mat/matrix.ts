import claw from 'claw-js';

type Shape = {
  rows: number;
  cols: number;
}

export type Index2D = {
  i: number;
  j: number;
}


export class Matrix {
  _mat: claw.Float32Matrix;

  constructor(rows: number, cols: number = 1) {
    this._mat = new claw.Float32Matrix(rows, cols);
  }

  shape() {
    return {
      rows: this._mat.shape()[0],
      cols: this._mat.shape()[1]
    } as Shape;
  }

  get(index: Index2D) {
    return this._mat.get(index.i, index.j);
  }

  map(f: (element: number, rowIndex: number, colIndex: number) => number): Matrix {
    for (let i = 0; i < this.shape().rows; i++) {
      for (let j = 0; j < this.shape().cols; j++) {
        this._mat.set(i, j, f(this._mat.get(i, j), i, j));
      }
    }
    return this;
  }

  copy(): Matrix {
    let mat = new Matrix(this.shape().rows, this.shape().cols);
    mat._mat = this._mat.copy();
    return mat;
  }

  static from = (arr: number[]) => new Matrix(arr.length, 1).map((e, i) => arr[i]);

  static random(rows: number, cols: number = 1) {
    let matrix = new Matrix(rows, cols);
    return matrix.map(() => Math.random() * 2 - 1);
  }

  // inplace functions modify the original matrix
  addInplace(matrix: Matrix): Matrix {
    this._mat.add(matrix._mat);
    return this;
  }

  subtractInplace(matrix: Matrix): Matrix {
    this._mat.subtract(matrix._mat);
    return this;
  }

  scaleInplace(n: number | Matrix): Matrix {
    if (n instanceof Matrix) {
      this._mat = claw.hadamard(this._mat, n._mat);
    } else {
      this._mat.scale(n);
    }
    return this;
  }

  getMaxValIndex(): Index2D {
    let maxIndex: Index2D = {i: 0, j: 0};

    for (let i = 0; i < this.shape().rows; i++) {
      for (let j = 0; j < this.shape().cols; j++) {
        if (this.get({i, j}) > this.get(maxIndex)) {
          maxIndex = {i, j};
        }
      }
    }
    return maxIndex;
  }

  getMinValIndex(): Index2D {
    let minIndex: Index2D = {i: 0, j: 0};

    for (let i = 0; i < this.shape().rows; i++) {
      for (let j = 0; j < this.shape().cols; j++) {
        if (this.get({i, j}) < this.get(minIndex)) {
          minIndex = {i, j};
        }
      }
    }
    return minIndex;
  }
}

export class MatrixMath {
  // these operations do not modify the original matrices
  static add(matrix1: Matrix, matrix2: Matrix): Matrix {
    let m = matrix1.copy();
    m.addInplace(matrix2);
    return m;
  }

  static subtract(matrix1: Matrix, matrix2: Matrix): Matrix {
    let m = matrix1.copy();
    m.subtractInplace(matrix2);
    return m;
  }

  static dot(matrix1: Matrix, matrix2: Matrix): Matrix {
    let m = new Matrix(matrix1.shape().rows, matrix2.shape().cols);
    m._mat = claw.matmul(matrix1._mat, matrix2._mat);
    return m;
  }

  static transpose(matrix: Matrix): Matrix {
    let m = new Matrix(matrix.shape().cols, matrix.shape().rows);
    m._mat.T();
    return m;
  }
}

