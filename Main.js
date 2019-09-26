let actualXRotationAngle = 0;
let actualYRotationAngle = 0;
let actualDiameter = 150;
let actualWallThickness = 20;
let actualLength = 700;
const canvas = document.querySelector('canvas');
const internalDiameterInput = document.querySelector('input.internalDiameter');
const wallThicknessInput = document.querySelector('input.wallThickness');
const lengthInput = document.querySelector('input.length');

let isCanvasClicked = false;
canvas.onmousedown = () => isCanvasClicked = true;
canvas.onmouseup = () => isCanvasClicked = false;
canvas.onmousemove = (event) => {
    if (isCanvasClicked) {
        actualXRotationAngle += (event.movementY/50);
        actualYRotationAngle += (event.movementX/50);
        drawScene();
    } 
}
canvas.onwheel = (event) => {
        event.preventDefault();
        actualDiameter = actualDiameter >= 0 ? actualDiameter - event.deltaY/4 : 0;
        internalDiameterInput.value = actualDiameter; 
        drawScene();
}

internalDiameterInput.value = actualDiameter;
internalDiameterInput.onchange = (event) => {
    actualDiameter = event.target.value;
    drawScene();
}

wallThicknessInput.value = actualWallThickness;
wallThicknessInput.onchange = (event) => {
    actualWallThickness = event.target.value;
    drawScene();
}

lengthInput.value = actualLength;
lengthInput.onchange = (event) => {
    actualLength = event.target.value;
    drawScene();
}

const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
attribute vec4 position;
attribute vec3 normal;
uniform vec3 resolution;
uniform mat4 rotationMatrix;
varying vec3 vNormal;
void main() {
    vec4 rotatedPosition = rotationMatrix * vec4(position.xyz/resolution, 1.0);
    gl_Position = vec4(rotatedPosition.xy/(1.0 + rotatedPosition.z * -0.9), rotatedPosition.zw);
    vNormal = (rotationMatrix * vec4(normal, 1.0)).xyz;
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;
varying vec3 vNormal;
uniform vec3 reverseLight;
void main() {
    float brightness = dot(normalize(vNormal), reverseLight);
    gl_FragColor = vec4(1, 0, 0, 1);
    gl_FragColor.x = gl_FragColor.x * brightness;
}
`);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, 'position');
const normalLocation = gl.getAttribLocation(program, 'normal');
const rotationMatrixLocation = gl.getUniformLocation(program, 'rotationMatrix');
const resolutionLocation = gl.getUniformLocation(program, 'resolution');
const reverseLightLocation = gl.getUniformLocation(program, 'reverseLight');

const normalBuffer = gl.createBuffer();
const positionBuffer = gl.createBuffer();

let normalizedReverseLight = [1, 1, 1].map((coordinate, index, vector) => coordinate / Math.sqrt((Math.pow(vector[0], 2) + Math.pow(vector[1], 2) + Math.pow(vector[2], 2))));
drawScene(0, 0, 0);

function drawScene() {
    const pipe = new Pipe(Math.max(0, actualDiameter), Math.max(0, actualWallThickness), Math.max(0, actualLength));
    const partsOfPipe = [pipe.backAnnulusData,
                         pipe.innerCylinderData,
                         pipe.outerCylinderData,
                         pipe.frontAnnulusData];
    let identityMatrix = [1, 0, 0, 0,
                          0, 1, 0, 0,
                          0, 0, 1, 0,
                          0, 0, 0, 1]
    let rotationMatrix = new Matrix4x4(identityMatrix)
        .rotateX(actualXRotationAngle)
        .rotateY(actualYRotationAngle)
        .rotateZ(0);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);

    gl.useProgram(program);
    gl.uniformMatrix4fv(rotationMatrixLocation, false, rotationMatrix.asArray());
    gl.uniform3fv(resolutionLocation, [gl.canvas.width, gl.canvas.height, 1280]);
    gl.uniform3fv(reverseLightLocation, normalizedReverseLight);

    let partNumber = 0;
    partsOfPipe.forEach((pipePart) =>{
        
        if (partNumber < 2) {
            gl.cullFace(gl.FRONT);
        } else {
            gl.cullFace(gl.BACK);
        }
        
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pipePart.vertexes), gl.STATIC_DRAW);               
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
        
        gl.enableVertexAttribArray(normalLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pipePart.normals), gl.STATIC_DRAW);              
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);       

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, (numberOfSegments + 1)*2);
        partNumber++;
    })
}