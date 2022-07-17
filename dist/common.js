import * as THREE from 'three';
export function generateGeometry(vertices) {
    const shape = new THREE.Shape(vertices);
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: false, /*bevelSegments: 1, steps: 1, bevelSize: 0.1, bevelThickness: 0.1*/ });
    return geometry;
}
export function fromContoursToGeometryVertices(contour, width, height) {
    const coords = contour.data32S;
    let geometryPoints = [];
    for (let index = 0; index < coords.length; index += 2) {
        geometryPoints.push(new THREE.Vector2(coords[index] / width, -coords[index + 1] / height));
    }
    return geometryPoints;
}
