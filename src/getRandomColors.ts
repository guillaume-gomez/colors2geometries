import cv, { Mat, MatVector } from "opencv-ts";
import { getChildren } from "./hierarchyUtils";
import { pixel, getColorRGB  } from "./colors";

// use montecarlo (pick random point in the shape to detect the color)
// the problem can be the shape has children on it
export default function getRandomColors(contours: MatVector, hierarchy: Mat, contourIndex: number, image: Mat, nbColors: number = 20) : pixel[] {
    let colors : Array<[number, number, number]> = [];
    const coords = contours.get(contourIndex).data32S;
    const childrenIndexes = getChildren(hierarchy, contourIndex);

    const XPoints : number[] = Array.from(coords.filter((coord, index) => index % 2 === 0));
    const YPoints : number[] = Array.from(coords.filter((coord, index) => index % 2 === 1));

    const minX = Math.min(...XPoints);
    const maxX = Math.max(...XPoints);

    const minY = Math.min(...YPoints);
    const maxY = Math.max(...YPoints);

    let exponentialBackoff = 50;

    while(colors.length <= nbColors && exponentialBackoff >= 0 ) {
        const middleCoordX = Math.floor(getRandomArbitrary(minX, maxX));
        const middleCoordY = Math.floor(getRandomArbitrary(minY, maxY));


        if(isPointValid(contours, contourIndex, middleCoordX, middleCoordY, childrenIndexes)) {
            colors.push(getColorRGB(image, middleCoordX, middleCoordY));
            exponentialBackoff = 50;
        } else {
            exponentialBackoff--;
        }
    }
    return colors;
}

function isInPolygon(contour: Mat, x: number, y : number) : boolean {
    return cv.pointPolygonTest(contour, new cv.Point(x, y), false) > 0;
}


function isNotInChildPolygon(contours: MatVector, x: number, y: number, childrenIndexes: number[]) {
    const child = childrenIndexes.find(childIndex => isInPolygon(contours.get(childIndex), x, y));
    return !child;
}

function isPointValid(contours: MatVector, contourIndex: number, x: number, y: number, childrenIndexes?: number[]) : boolean {
    if(!childrenIndexes || childrenIndexes.length === 0) {
        return isInPolygon(contours.get(contourIndex), x, y);
    } else {
        return isInPolygon(contours.get(contourIndex), x, y) && isNotInChildPolygon(contours, x, y, childrenIndexes);
    }
}


function getRandomArbitrary(min: number, max: number) : number {
  return Math.random() * (max - min) + min;
}

