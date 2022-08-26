import cv from "opencv-ts";
import { getChildren } from "./hierarchyUtils";
import { getColorRGB } from "./colors";
// use montecarlo (pick random point in the shape to detect the color)
// the problem can be the shape has children on it
export default function getRandomColors(contours, hierarchy, contourIndex, image, nbColors = 20) {
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
            colors.push(getColorRGB(image, middleCoordX, middleCoordY));
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
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
