import { Mat, MatVector } from "opencv-ts";
export declare type pixel = [number, number, number];
export declare function computePalette(image: Mat): pixel[];
export declare function getColor(image: Mat, x: number, y: number): [number, number, number];
export declare function getRandomColors(contours: MatVector, hierarchy: Mat, contourIndex: number, image: Mat, nbColors?: number): Array<[number, number, number]>;
