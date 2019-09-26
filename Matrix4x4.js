class Matrix4x4 {
    constructor(array) {
        this.matrix = array;
    }

    multiply(otherMatrixAsArray) {
        var a00 = this.matrix[0 * 4 + 0];
        var a01 = this.matrix[0 * 4 + 1];
        var a02 = this.matrix[0 * 4 + 2];
        var a03 = this.matrix[0 * 4 + 3];
        var a10 = this.matrix[1 * 4 + 0];
        var a11 = this.matrix[1 * 4 + 1];
        var a12 = this.matrix[1 * 4 + 2];
        var a13 = this.matrix[1 * 4 + 3];
        var a20 = this.matrix[2 * 4 + 0];
        var a21 = this.matrix[2 * 4 + 1];
        var a22 = this.matrix[2 * 4 + 2];
        var a23 = this.matrix[2 * 4 + 3];
        var a30 = this.matrix[3 * 4 + 0];
        var a31 = this.matrix[3 * 4 + 1];
        var a32 = this.matrix[3 * 4 + 2];
        var a33 = this.matrix[3 * 4 + 3];
        var b00 = otherMatrixAsArray[0 * 4 + 0];
        var b01 = otherMatrixAsArray[0 * 4 + 1];
        var b02 = otherMatrixAsArray[0 * 4 + 2];
        var b03 = otherMatrixAsArray[0 * 4 + 3];
        var b10 = otherMatrixAsArray[1 * 4 + 0];
        var b11 = otherMatrixAsArray[1 * 4 + 1];
        var b12 = otherMatrixAsArray[1 * 4 + 2];
        var b13 = otherMatrixAsArray[1 * 4 + 3];
        var b20 = otherMatrixAsArray[2 * 4 + 0];
        var b21 = otherMatrixAsArray[2 * 4 + 1];
        var b22 = otherMatrixAsArray[2 * 4 + 2];
        var b23 = otherMatrixAsArray[2 * 4 + 3];
        var b30 = otherMatrixAsArray[3 * 4 + 0];
        var b31 = otherMatrixAsArray[3 * 4 + 1];
        var b32 = otherMatrixAsArray[3 * 4 + 2];
        var b33 = otherMatrixAsArray[3 * 4 + 3];
        return new Matrix4x4([
          b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
          b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
          b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
          b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
          b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
          b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
          b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
          b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
          b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
          b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
          b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
          b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
          b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
          b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
          b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
          b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ]);
      }

      rotateX(angle) {
        return this.multiply([
          1, 0, 0, 0,
          0, Math.cos(angle), Math.sin(angle), 0,
          0, -Math.sin(angle), Math.cos(angle), 0,
          0, 0, 0, 1
        ]);
      }

      rotateY(angle) {
        return this.multiply([
          Math.cos(angle), 0, -Math.sin(angle), 0,
          0, 1, 0, 0,
          Math.sin(angle), 0, Math.cos(angle), 0,
          0, 0, 0, 1
        ]);
      }

      rotateZ(angle) {
        return this.multiply([
          Math.cos(angle), Math.sin(angle), 0, 0,
          -Math.sin(angle), Math.cos(angle), 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        ]);
      }

      asArray() {
        return this.matrix;
    }
}