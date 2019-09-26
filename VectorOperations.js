class VectorOperations {
    static normalizeVector(vector) {
        return vector.map((coordinate, index, vector) => 
                coordinate / Math.sqrt((Math.pow(vector[0], 2) + Math.pow(vector[1], 2) + Math.pow(vector[2], 2))));
    }

    static crossProduct(vector1, vector2) {
        let result = [];
        result.push((vector1[1] * vector2[2]) - (vector1[2] * vector2[1]));
        result.push((vector1[2] * vector2[0]) - (vector1[0] * vector2[2]));
        result.push((vector1[0] * vector2[1]) - (vector1[1] * vector2[0]));
        return result;
    }
}