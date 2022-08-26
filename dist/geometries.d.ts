import { Mat } from "opencv-ts";
import * as THREE from 'three';
export declare function generateGeometry(vertices: THREE.Vector2[]): THREE.BufferGeometry;
export declare function fromContoursToGeometryVertices(contour: Mat, width: number, height: number): THREE.Vector2[];
