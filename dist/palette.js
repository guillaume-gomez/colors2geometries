import cv from "opencv-ts";
import { getChildren } from "./hierarchyUtils";
export function computePalette(image) {
    // loop through pixels to determine colors
    let colorsInImage = {};
    for (let x = 0; x < image.cols; x++) {
        for (let y = 0; y < image.rows; y++) {
            const key = getColor(image, x, y).toString();
            if (colorsInImage[key]) {
                colorsInImage[key] += 1;
            }
            else {
                colorsInImage[key] = 1;
            }
        }
    }
    const filteredColorInImage = filterColorInImageTo(colorsInImage, image.cols * image.rows, .01);
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
export function getColor(image, x, y) {
    const { data, cols } = image;
    const channels = image.channels();
    const R = data[y * cols * channels + x * channels];
    const G = data[y * cols * channels + x * channels + 1];
    const B = data[y * cols * channels + x * channels + 2];
    return [R, G, B];
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
// use montecarlo (pick random point in the shape to detect the color)
// the problem can be the shape has children on it
export function getRandomColors(contours, hierarchy, contourIndex, image, nbColors = 20) {
    let colors = [];
    const coords = contours.get(contourIndex).data32S;
    const childrenIndexes = getChildren(hierarchy, contourIndex);
    const XPoints = Array.from(coords.filter((coord, index) => index % 2 === 0));
    const YPoints = Array.from(coords.filter((coord, index) => index % 2 === 1));
    const minX = Math.min(...XPoints);
    const maxX = Math.max(...XPoints);
    const minY = Math.min(...YPoints);
    const maxY = Math.max(...YPoints);
    let exponentialBackoff = 50;
    while (colors.length <= nbColors && exponentialBackoff >= 0) {
        const middleCoordX = Math.floor(getRandomArbitrary(minX, maxX));
        const middleCoordY = Math.floor(getRandomArbitrary(minY, maxY));
        if (isPointValid(contours, contourIndex, middleCoordX, middleCoordY, childrenIndexes)) {
            colors.push(getColor(image, middleCoordX, middleCoordY));
            exponentialBackoff = 50;
        }
        else {
            exponentialBackoff--;
        }
    }
    return colors;
}
function isInPolygon(contour, x, y) {
    return cv.pointPolygonTest(contour, new cv.Point(x, y), false) > 0;
}
function isNotInChildPolygon(contours, x, y, childrenIndexes) {
    const child = childrenIndexes.find(childIndex => isInPolygon(contours.get(childIndex), x, y));
    return !child;
}
function isPointValid(contours, contourIndex, x, y, childrenIndexes) {
    if (!childrenIndexes || childrenIndexes.length === 0) {
        return isInPolygon(contours.get(contourIndex), x, y);
    }
    else {
        return isInPolygon(contours.get(contourIndex), x, y) && isNotInChildPolygon(contours, x, y, childrenIndexes);
    }
}
