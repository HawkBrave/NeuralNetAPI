type Shape = {
  rows: number;
  cols: number;
}

export type Index2D = {
  i: number;
  j: number;
}


export class Matrix {
  shape: Shape;
  values: Array<Array<number>>;

  constructor(rows: number, cols: number = 1) {
    this.shape = {rows, cols};
    this.values = new Array(this.shape.rows)
      .fill(0)
      .map(() => new Array(this.shape.cols).fill(0));
  }

  get(index: Index2D) {
    return this.values[index.i][index.j];
  }

  map(f: (element: number, rowIndex: number, colIndex: number) => number): Matrix {
    for (let i = 0; i < this.shape.rows; i++) {
      for (let j = 0; j < this.shape.cols; j++) {
        this.values[i][j] = f(this.values[i][j], i, j);
      }
    }
    return this;
  }

  copy(): Matrix {
    let mat = new Matrix(this.shape.rows, this.shape.cols);
    for (let i = 0; i < this.shape.rows; i++) {
      for (let j = 0; j < this.shape.cols; j++) {
        mat.values[i][j] = this.values[i][j];
      }
    }
    return mat;
  }

  static from = (arr: number[]) => new Matrix(arr.length, 1).map((e, i) => arr[i]);

  static random(rows: number, cols: number = 1) {
    let matrix = new Matrix(rows, cols);
    return matrix.map(() => Math.random() * 2 - 1);
  }

  array(): Array<Array<number>> {
    let arr = new Array();
    for (let i = 0; i < this.shape.rows; i++) {
      arr.push(this.values[i].slice());
    }
    return arr;
  }

  toString(): string {
    return this.values.toString();
  }

  // inplace functions modify the original matrix
  addInplace(matrix: Matrix): Matrix {
    if (this.shape.rows != matrix.shape.rows || this.shape.cols != matrix.shape.cols) {
      throw new Error("Rows and cols of matrix must match.");
    }

    return this.map((el, i, j) => el + matrix.values[i][j]);
  }

  subtractInplace(matrix: Matrix): Matrix {
    if (this.shape.rows != matrix.shape.rows || this.shape.cols != matrix.shape.cols) {
      throw new Error("Rows and cols of matrix must match.");
    }

    return this.map((el, i, j) => el - matrix.values[i][j]);
  }

  scaleInplace(n: number | Matrix): Matrix {
    if (n instanceof Matrix) {
      this.map((el, i, j) => el * n.values[i][j]);
    } else {
      this.map(el => el * n);
    }
    return this;
  }

  getMaxValIndex(): Index2D {
    let maxIndex: Index2D = {i: 0, j: 0};

    for (let i = 0; i < this.shape.rows; i++) {
      for (let j = 0; j < this.shape.cols; j++) {
        if (this.get({i, j}) > this.get(maxIndex)) {
          maxIndex = {i, j};
        }
      }
    }
    return maxIndex;
  }

  getMinValIndex(): Index2D {
    let minIndex: Index2D = {i: 0, j: 0};

    for (let i = 0; i < this.shape.rows; i++) {
      for (let j = 0; j < this.shape.cols; j++) {
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
    if (matrix1.shape.rows != matrix2.shape.rows || matrix1.shape.cols != matrix2.shape.cols) {
      throw new Error("Rows and cols of matrix must match.");
    }

    let mat = matrix1.copy();
    return mat.map((el, i, j) => el + matrix2.values[i][j]);
  }

  static subtract(matrix1: Matrix, matrix2: Matrix): Matrix {
    if (matrix1.shape.rows != matrix2.shape.rows || matrix1.shape.cols != matrix2.shape.cols) {
      throw new Error("Rows and cols of matrix must match.");
    }

    let mat = matrix1.copy();
    return mat.map((el, i, j) => el - matrix2.values[i][j]);
  }

  static scale(matrix: Matrix, n: number | Matrix): Matrix {
    let mat = matrix.copy();
    if (n instanceof Matrix) {
      mat.map((el, i, j) => el * n.values[i][j]);
    } else {
      mat.map(el => el * n);
    }
    return mat;
  }

  static dot(matrix1: Matrix, matrix2: Matrix): Matrix {
    if (matrix1.shape.cols != matrix2.shape.rows) {
      throw Error("Cols of the matrix1 must me equal to rows of matrix2");
    }

    let mat = new Matrix(matrix1.shape.rows, matrix2.shape.cols);
    for (let i = 0; i < mat.shape.rows; i++) {
      for (let j = 0; j < mat.shape.cols; j++) {
        let sum = 0;
        for (let r = 0; r < matrix1.shape.cols; r++) {
          sum += matrix1.values[i][r] * matrix2.values[r][j];
        }
        mat.values[i][j] = sum;
      }
    }
    return mat;
  }

  static transpose(matrix: Matrix): Matrix {
    let mat = new Matrix(matrix.shape.cols, matrix.shape.rows);
    return mat.map((el, i, j) => matrix.values[j][i]);
  }
}

