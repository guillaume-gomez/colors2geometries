import { Mat } from "opencv-ts";
import { pixelRGBA } from "./colors";
declare type paletteAlgorithm = "threshold" | "quantification";
interface computePaletteParams {
    precision?: number;
    numberOfColors?: number;
    image: HTMLImageElement | Mat;
}
export declare function computePalette(type: paletteAlgorithm, params: computePaletteParams): pixelRGBA[];
export {};
