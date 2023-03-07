import { Mat } from "opencv-ts";
export type pixel = [number, number, number];
export type pixelRGBA = [number, number, number, number];
export declare function getColorRGB(image: Mat, x: number, y: number): [number, number, number];
export declare function getColorRGBA(image: Mat, x: number, y: number): pixelRGBA;
export declare function distance([x1, y1, z1, a1]: pixelRGBA, [x2, y2, z2, a2]: pixelRGBA): number;
