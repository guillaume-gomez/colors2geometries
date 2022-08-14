import cv, { Mat, MatVector } from "opencv-ts";
import ColorThief from 'colorthief';
import { getColorRGBA, pixelRGBA } from "./colors";
import { getChildren } from "./hierarchyUtils";

// todo remove colors that occurs less than 1%
// + sort by proportion of colors desc

interface ColorInImage {
  [key:string]: number;
}

type paletteAlgorithm = "threshold" | "quantification";

interface computePaletteParams {
    precision?: number;
    numberOfColors?: number;
    image: HTMLImageElement | Mat,
}



export function computePalette(type: paletteAlgorithm, params: computePaletteParams) : pixelRGBA[] {
    switch(type) {
        case "quantification":
            const { image, numberOfColors } = params;
            return computePaletteQuantification(image as HTMLImageElement, numberOfColors);
        case "threshold":
        default: {
            const { image, precision } = params;
            return computePaletteThreshold(image as Mat, precision);
        }
    }
}

function computePaletteQuantification(image: HTMLImageElement, paletteSize: number = 20) : pixelRGBA[] {
  let colorThief = new ColorThief();
  const paletteRGB : Array<[number, number, number]> = colorThief.getPalette(image, paletteSize);
  return paletteRGB.map(([r,g,b]) => [r,g,b, 255]);
}

function computePaletteThreshold(image: Mat, precision: number = 0.005) : pixelRGBA[] {
  // loop through pixels to determine colors
  let colorsInImage : ColorInImage = {};
  for(let x = 0; x < image.cols; x++) {
    for (let y = 0; y < image.rows; y++) {
      const key = getColorRGBA(image, x, y).toString();
      if(colorsInImage[key]) {
        colorsInImage[key] += 1;
      } else {
        colorsInImage[key] = 1;
      }
    }
  }

  const filteredColorInImage : Array<[string, number]> = filterColorInImageTo(colorsInImage, image.cols * image.rows, precision);

  const palette : pixelRGBA[] = filteredColorInImage.map(([pixel, _]) => convertPixelStringToPixelNumber(pixel));
  return palette;
}

function filterColorInImageTo(colorsInImage: ColorInImage, nbPixel: number, keepPercentage: number) : Array<[string, number]> {
  const result = Object.entries(colorsInImage).filter(([colorString, nbOccurence]) => (nbOccurence/nbPixel) >= keepPercentage);
  return result.sort(function([_pixelStringA, occurenceA], [_pixelStringB, occurenceB]) { return occurenceA - occurenceB});
}

function convertPixelStringToPixelNumber(pixelString: string ) : pixelRGBA {
  const pixel = (pixelString.split(",").map(colorString => parseInt(colorString, 10)) as pixelRGBA);
  return pixel;
}
