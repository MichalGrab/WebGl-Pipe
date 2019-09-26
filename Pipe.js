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

    calculateFrontAnnulusNormals() {
        let normals = []
        let normal = this.calculateVertexNormalInTriangleStrip(this.frontAnnulus.innerCirclePoints[0], this.frontAnnulus.outerCirclePoints[0], this.frontAnnulus.outerCirclePoints[1]);
        for (let i = 0; i < numberOfSegments * 2 * 3; i++) {
            normals.push(...normal);
        }
        return normals;
    }

    calculateBackAnnulusNormals() {
        let normals = []
        let normal = this.calculateVertexNormalInTriangleStrip(this.backAnnulus.outerCirclePoints[0], this.backAnnulus.innerCirclePoints[0], this.backAnnulus.outerCirclePoints[1]);
        for (let i = 0; i < numberOfSegments * 2 * 3; i++) {
            normals.push(...normal);
        }
        return normals;
    }

    calculateVertexNormalInTriangleStrip(pointOnTheLeft, actualPoint, pointOnTheRight) {
        const vector1 = [pointOnTheRight.x - actualPoint.x,
            pointOnTheRight.y - actualPoint.y,
            pointOnTheRight.z - actualPoint.z];
        const vector2 = [pointOnTheLeft.x - actualPoint.x,
            pointOnTheLeft.y - actualPoint.y,
            pointOnTheLeft.z - actualPoint.z];

        let normal = VectorOperations.crossProduct(vector1, vector2);

        return VectorOperations.normalizeVector(normal);       
    }

    

    get innerCylinderData() {
        let vertexes = [];
        this.innerCylinder.forEach((value) => {vertexes.push(value.x, value.y, value.z)});
        let normals = [];
        normals.push(...this.calculateVertexNormalInTriangleStrip(this.innerCylinder[1], this.innerCylinder[0],this.innerCylinder[2]));
        for (let i = 1; i < (this.innerCylinder.length - 1); i = i + 2) {
            normals.push(...this.calculateVertexNormalInTriangleStrip(this.innerCylinder[i+1], this.innerCylinder[i],this.innerCylinder[i-1]));
            normals.push(...this.calculateVertexNormalInTriangleStrip(this.innerCylinder[i], this.innerCylinder[i+1],this.innerCylinder[i+2]));
        }
        normals.push(...this.calculateVertexNormalInTriangleStrip(this.innerCylinder[this.innerCylinder.length-2], this.innerCylinder[this.innerCylinder.length-1],this.innerCylinder[this.innerCylinder.length-3]));
        for(let i = 0; i < 6; i++) {
            normals[normals.length - (6 - i)] = normals[i];
        }

        return {
            vertexes : vertexes,
            normals : normals
            };
    }

    get outerCylinderData() {
        let vertexes = [];
        this.outerCylinder.forEach((value) => {vertexes.push(value.x, value.y, value.z)});
        let normals = [];
        normals.push(...this.calculateVertexNormalInTriangleStrip(this.outerCylinder[2], this.outerCylinder[0],this.outerCylinder[1]));
        for (let i = 1; i < (this.outerCylinder.length - 1); i = i + 2) {
            normals.push(...this.calculateVertexNormalInTriangleStrip(this.outerCylinder[i-1], this.outerCylinder[i],this.outerCylinder[i+1]));
            normals.push(...this.calculateVertexNormalInTriangleStrip(this.outerCylinder[i+2], this.outerCylinder[i+1],this.outerCylinder[i]));
        }
        normals.push(...this.calculateVertexNormalInTriangleStrip(this.outerCylinder[this.outerCylinder.length-3], this.outerCylinder[this.outerCylinder.length-1],this.outerCylinder[this.outerCylinder.length-2]));
        for(let i = 0; i < 6; i++) {
            normals[normals.length - (6 - i)] = normals[i];
        }

        return {
            vertexes : vertexes,
            normals : normals
            };
    }

    get frontAnnulusData() {
        let vertexes = this.calculateAnnulusVertexes(this.frontAnnulus);
        let normals = this.calculateFrontAnnulusNormals();
        return {
                vertexes : vertexes,
                normals : normals
                };
    }

    get backAnnulusData() {
        let vertexes = this.calculateAnnulusVertexes(this.backAnnulus);
        let normals = this.calculateBackAnnulusNormals();
        return {
                vertexes : vertexes,
                normals : normals
                };
    }
}

class Point {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}