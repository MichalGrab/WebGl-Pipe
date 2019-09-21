class Point {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

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
const numberOfSegments = 20;
class Pipe {
    constructor (internalDiameter, wallThickness, length) {
        let innerRadius = internalDiameter / 2;
        let outerRadius = innerRadius + wallThickness;
        this.frontAnnulus = createAnnulus(length/2);
        this.backAnnulus = createAnnulus(-length/2);
        this.innerCylinder = createCylinder(this.frontAnnulus.innerCirclePoints, this.backAnnulus.innerCirclePoints);
        this.outerCylinder = createCylinder(this.frontAnnulus.outerCirclePoints, this.backAnnulus.outerCirclePoints);

        function createCircle(zCoordinate, radius) {
            let points = [];
            const angle = 2 * Math.PI/numberOfSegments;
            for (let i = 0; i < numberOfSegments; i++) {
                points.push(new Point(Math.cos(angle * i) * radius, Math.sin(angle * i) * radius , zCoordinate));
            }
            return points;
        };

        function createAnnulus (zCoordinate) {
            let innerCirclePoints = createCircle(zCoordinate, innerRadius, numberOfSegments);
            let outerCirclePoints = createCircle(zCoordinate, outerRadius, numberOfSegments);

            return {innerCirclePoints: innerCirclePoints,
                    outerCirclePoints: outerCirclePoints}
        };

        function createCylinder (frontAnnulusCirclePoints, backAnnulusCirclePoints) {
            let cylinderPoints = [];
            for (let i = 0; i < frontAnnulusCirclePoints.length; i++) {
                cylinderPoints.push(frontAnnulusCirclePoints[i]);
                cylinderPoints.push(backAnnulusCirclePoints[i]);
            }
            cylinderPoints.push(frontAnnulusCirclePoints[0]);
            cylinderPoints.push(backAnnulusCirclePoints[0]);

            return cylinderPoints;
        }
        //     let outerWallPoints = [];

        //     for (let i = 0; i < this.frontAnnulus.outerCirclePoints.length; i++) {
        //         outerWallPoints.push(this.frontAnnulus.outerCirclePoints[i]);
        //         outerWallPoints.push(this.backAnnulus.outerCirclePoints[i]);
        //     }
        //     outerWallPoints.push(this.frontAnnulus.outerCirclePoints[0]);
        //     outerWallPoints.push(this.backAnnulus.outerCirclePoints[0]);

        //     return {innerWallPoints: innerWallPoints,
        //             outerWallPoints: outerWallPoints}
        // }

        // function createInnerWall() {
        //     return createPipeWall(this.frontAnnulus.innerCirclePoints, this.backAnnulus.innerCirclePoints)
        // }
        // function createOuterWall() {
        //     return createPipeWall(this.frontAnnulus.outerCirclePoints, this.backAnnulus.outerCirclePoints)
        // }
    }

    calculateAnnulusVertexes(annulus) {
        let vertexes = [];
        for (let i = 0; i < numberOfSegments; i++) {
            vertexes = [...vertexes, annulus.innerCirclePoints[i].x, annulus.innerCirclePoints[i].y, annulus.innerCirclePoints[i].z,
                                    annulus.outerCirclePoints[i].x, annulus.outerCirclePoints[i].y, annulus.outerCirclePoints[i].z];
        }
        vertexes = [...vertexes, annulus.innerCirclePoints[0].x, annulus.innerCirclePoints[0].y, annulus.innerCirclePoints[0].z,
                                annulus.outerCirclePoints[0].x, annulus.outerCirclePoints[0].y, annulus.outerCirclePoints[0].z];
        return vertexes;
    }

    get innerCylinderVertexes() {
        let vertexes = [];
        this.innerCylinder.forEach((value) => {vertexes.push(value.x, value.y, value.z)});
        return vertexes;
    }

    get outerCylinderVertexes() {
        let vertexes = [];
        this.outerCylinder.forEach((value) => {vertexes.push(value.x, value.y, value.z)});
        return vertexes;
    }

    get frontAnnulusVertexes() {
        return this.calculateAnnulusVertexes(this.frontAnnulus);
    }

    get backAnnulusVertexes() {
        return this.calculateAnnulusVertexes(this.backAnnulus);
    }

}

let actualXRotationAngle = 0;
let actualYRotationAngle = 0;
const canvas = document.querySelector('canvas');
let isClicked = false;
canvas.onmousedown = () => isClicked = true;
canvas.onmouseup = () => isClicked = false;
canvas.onmousemove = (event) => {if (isClicked) {drawScene(event.movementX/50, event.movementY/50)};}


const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
attribute vec4 position;
uniform vec2 resolution;
uniform mat4 rotationMatrix;
void main() {
    vec4 rotatedPosition = rotationMatrix * vec4(position.xy/resolution, position.z, 1.0);
    gl_Position = vec4(rotatedPosition.xyz, -rotatedPosition.z + 1.0);
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
}
`);

gl.compileShader(fragmentShader);
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, 'position');
const rotationMatrixLocation = gl.getUniformLocation(program, 'rotationMatrix');
const resolutionLocation = gl.getUniformLocation(program, 'resolution');

const pipe = new Pipe(150, 20, 0.5);
const buffer = gl.createBuffer();
const partsOfPipe = [pipe.backAnnulusVertexes,
                     pipe.innerCylinderVertexes,
                     pipe.outerCylinderVertexes,
                     pipe.frontAnnulusVertexes];

drawScene(0, 0);





function drawScene(yRotationAngle, xRotationAngle) {
    actualYRotationAngle += yRotationAngle;
    actualXRotationAngle += xRotationAngle;
    let rotationMatrix = new Matrix4x4([1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1])
        .rotateX(actualXRotationAngle)
        .rotateY(actualYRotationAngle)
        .rotateZ(0);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    partsOfPipe.forEach((pipePart) =>{
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pipePart), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(rotationMatrixLocation, false, rotationMatrix.asArray());
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, (20 + 1)*2);
    })
}
// inner cylinder


// outer cylinder
// gl.useProgram(program);
// gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pipe.outerCylinderVertexes), gl.STATIC_DRAW);

// gl.enableVertexAttribArray(positionLocation);
// gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

// // let rotationMatrix = new Matrix4x4([1, 0, 0, 0,
// //     0, 1, 0, 0,
// //     0, 0, 1, 0,
// //     0, 0, 0, 1])
// //     .rotateX(actualXRotationAngle)
// //     .rotateY(actualYRotationAngle)
// //     .rotateZ(0);

// gl.uniformMatrix4fv(rotationMatrixLocation, false, rotationMatrix.asArray());
// gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
// gl.drawArrays(gl.TRIANGLE_STRIP, 0, (20 + 1)*2);
// }