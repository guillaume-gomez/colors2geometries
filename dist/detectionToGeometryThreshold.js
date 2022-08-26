import cv from "opencv-ts";
import getRandomColors from "./getRandomColors";
import { getColorRGB } from "./colors";
import { getParent } from "./hierarchyUtils";
import { generateGeometry, fromContoursToGeometryVertices } from "./geometries";
import * as THREE from 'three';
function geneterateColour(contours, hierarchy, contourIndex, image) {
    const contour = contours.get(contourIndex);
    const randomColors = getRandomColors(contours, hierarchy, contourIndex, image);
    const centroid = cv.moments(contour);
    const cX = Math.ceil(centroid["m10"] / centroid["m00"]);
    const cY = Math.ceil(centroid["m01"] / centroid["m00"]);
    const centroidColor = getColorRGB(image, cX, cY);
    const reduced = [...randomColors, centroidColor].reduce(function (acc, curr) {
        return acc[curr.toString()] ? ++acc[curr.toString()] : acc[curr.toString()] = 1, acc;
    }, {});
    // get the most occurs colors among the array of random colors + the middle point
    let max = -1;
    let colorChoosedStringified = "-1,-1,-1";
    Object.entries(reduced).forEach(([colorStringified, occurences]) => {
        if (max < occurences) {
            max = occurences;
            colorChoosedStringified = colorStringified;
        }
    });
    const [R, G, B] = colorChoosedStringified.split(",").map(color => parseInt(color));
    return new THREE.Color(R / 255, G / 255, B / 255);
}
function generateGeometries(contours, hierarchy, image) {
    let meshes = [];
    const offset = 0.001;
    const { rows, cols } = image;
    for (let i = 0; i < contours.size(); ++i) {
        const contour = contours.get(i);
        const vertices = fromContoursToGeometryVertices(contour, rows, cols);
        const geometry = generateGeometry(vertices);
        const color = geneterateColour(contours, hierarchy, i, image);
        const material = new THREE.MeshBasicMaterial({ color /*: Math.random() * 0x0FF05F*/, wireframe: false /*, side: THREE.DoubleSide*/ });
        const mesh = new THREE.Mesh(geometry, material);
        const child = getParent(hierarchy, i);
        mesh.position.z = child * offset;
        meshes.push(mesh);
    }
    return meshes;
}
//use threshold to detect colors and shape with a binarythreshold and its opposite
export function generateFlagsByThreshold(imageDomId, minThreshold, maxThreshold) {
    const src = cv.imread(imageDomId);
    const greyScaleImage = new cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
    const binaryThreshold = new cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
    const inverseBinaryThreshold = new cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
    const dst = new cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC4);
    let meshes = [];
    cv.cvtColor(src, greyScaleImage, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(greyScaleImage, binaryThreshold, minThreshold, maxThreshold, cv.THRESH_BINARY);
    cv.threshold(greyScaleImage, inverseBinaryThreshold, minThreshold, maxThreshold, cv.THRESH_BINARY_INV);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(binaryThreshold, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
    meshes = [...meshes, ...generateGeometries(contours, hierarchy, src)];
    contours.delete();
    hierarchy.delete();
    contours = new cv.MatVector();
    hierarchy = new cv.Mat();
    /*
        DEBUG
        cv.findContours(inverseBinaryThreshold, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
        meshes = [...meshes, ...generateGeometries(contours, hierarchy, src)];

        // draw contours with random Scalar
        for (let i = 0; i < contours.size(); ++i) {
            const color = new cv.Scalar(
                Math.round(Math.random() * 255),
                Math.round(Math.random() * 255),
                Math.round(Math.random() * 255)
            );
            cv.drawContours(dst, contours, i, color, 5, cv.LINE_8, hierarchy, 100);
        }
        cv.imshow('canvasTest', binaryThreshold);
        cv.imshow('canvasTest2', inverseBinaryThreshold);
        cv.imshow('contours', dst);
    */
    src.delete();
    dst.delete();
    contours.delete();
    hierarchy.delete();
    return meshes;
}
