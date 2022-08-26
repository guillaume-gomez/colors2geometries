import { Mat, MatVector } from "opencv-ts";
import { pixel } from "./colors";
export default function getRandomColors(contours: MatVector, hierarchy: Mat, contourIndex: number, image: Mat, nbColors?: number): pixel[];
