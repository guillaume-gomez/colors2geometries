import ColorThief from 'colorthief';
import { getColorRGBA } from "./colors";
export function computePalette(type, params) {
    switch (type) {
        case "quantification":
            const { image, numberOfColors } = params;
            return computePaletteQuantification(image, numberOfColors);
        case "threshold":
        default: {
            const { image, precision } = params;
            return computePaletteThreshold(image, precision);
        }
    }
}
function computePaletteQuantification(image, paletteSize = 20) {
    let colorThief = new ColorThief();
    const paletteRGB = colorThief.getPalette(image, paletteSize);
    return paletteRGB.map(([r, g, b]) => [r, g, b, 255]);
}
function computePaletteThreshold(image, precision = 0.005) {
    // loop through pixels to determine colors
    let colorsInImage = {};
    for (let x = 0; x < image.cols; x++) {
        for (let y = 0; y < image.rows; y++) {
            const key = getColorRGBA(image, x, y).toString();
            if (colorsInImage[key]) {
                colorsInImage[key] += 1;
            }
            else {
                colorsInImage[key] = 1;
            }
        }
    }
    const filteredColorInImage = filterColorInImageTo(colorsInImage, image.cols * image.rows, precision);
    const palette = filteredColorInImage.map(([pixel, _]) => convertPixelStringToPixelNumber(pixel));
    return palette;
}
function filterColorInImageTo(colorsInImage, nbPixel, keepPercentage) {
    const result = Object.entries(colorsInImage).filter(([colorString, nbOccurence]) => (nbOccurence / nbPixel) >= keepPercentage);
    return result.sort(function ([_pixelStringA, occurenceA], [_pixelStringB, occurenceB]) { return occurenceA - occurenceB; });
}
function convertPixelStringToPixelNumber(pixelString) {
    const pixel = pixelString.split(",").map(colorString => parseInt(colorString, 10));
    return pixel;
}
