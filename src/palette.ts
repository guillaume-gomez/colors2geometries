import cv, { Mat, MatVector } from "opencv-ts";
import { getColorRGB, pixel } from "./colors";
import { getChildren } from "./hierarchyUtils";

// todo remove colors that occurs less than 1%
// + sort by proportion of colors desc

interface ColorInImage {
  [key:string]: number;
}

export function computePalette(image: Mat, precision: number = 0.005) : pixel[] {
  // loop through pixels to determine colors
  let colorsInImage : ColorInImage = {};
  for(let x = 0; x < image.cols; x++) {
    for (let y = 0; y < image.rows; y++) {
      const key = getColorRGB(image, x, y).toString();
      if(colorsInImage[key]) {
        colorsInImage[key] += 1;
      } else {
        colorsInImage[key] = 1;
      }
    }
  }

  const filteredColorInImage : Array<[string, number]> = filterColorInImageTo(colorsInImage, image.cols * image.rows, precision);

  const palette : pixel[] = filteredColorInImage.map(([pixel, _]) => convertPixelStringToPixelNumber(pixel));
  return palette;
}

function filterColorInImageTo(colorsInImage: ColorInImage, nbPixel: number, keepPercentage: number) : Array<[string, number]> {
  const result = Object.entries(colorsInImage).filter(([colorString, nbOccurence]) => (nbOccurence/nbPixel) >= keepPercentage);
  return result.sort(function([_pixelStringA, occurenceA], [_pixelStringB, occurenceB]) { return occurenceA - occurenceB});
}

 function convertPixelStringToPixelNumber(pixelString: string ) : pixel {
  const pixel = (pixelString.split(",").map(colorString => parseInt(colorString, 10)) as pixel);
  return pixel;
 }



/*function generateColorPalette(image: HTMLImageElement, paletteSize: number  = PALETTE_BASE_COLOR) : pixelRGBA[] {
  let colorThief = new ColorThief();
  const paletteRGB : Array<[number, number, number]> = colorThief.getPalette(image, paletteSize);
  return paletteRGB.map(([r,g,b]) => [r,g,b, 255]);
}*/
