import { computePalette } from "./palette";
import getRandomColors from './getRandomColors';
import { getParent } from "./hierarchyUtils";
import { generateGeometry, fromContoursToGeometryVertices } from "./geometries";
import { imageQuantified } from "./quantification";
import * as THREE from 'three';
import cv from "opencv-ts";
function checkColor(contours, hierarchy, image, color, index) {
    const randomColors = getRandomColors(contours, hierarchy, index, image, 5);
    const reduced = randomColors.reduce(function (acc, curr) {
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
    return R === color[0] && G === color[1] && B === color[2];
}
function generateGeometries(contours, hierarchy, image, [R, G, B], index) {
    let meshes = [];
    const offsetColor = 0.1;
    const offsetHierarchy = 0.3;
    const { rows, cols } = image;
    for (let i = 0; i < contours.size(); ++i) {
        // sometimes the color detection fails like tunisia (for example)
        if (!checkColor(contours, hierarchy, image, [R, G, B], i)) {
            continue;
        }
        const contour = contours.get(i);
        const vertices = fromContoursToGeometryVertices(contour, rows, cols);
        const geometry = generateGeometry(vertices);
        const color = new THREE.Color(R / 255, G / 255, B / 255);
        const material = new THREE.MeshStandardMaterial({ color /*: Math.random() * 0x0FF05F*/, wireframe: false });
        const mesh = new THREE.Mesh(geometry, material);
        const child = getParent(hierarchy, i);
        mesh.position.z = index * offsetColor + (child / (hierarchy.data32S.length / 4)) * offsetHierarchy;
        meshes.push(mesh);
    }
    return meshes;
}
function fromMatToGeometries(src, palette) {
    let meshes = [];
    let binaryThreshold = new cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC4);
    palette.forEach(([r, g, b], index) => {
        let low = new cv.Mat(src.rows, src.cols, src.type(), new cv.Scalar(r - 1, g - 1, b - 1, 255));
        let high = new cv.Mat(src.rows, src.cols, src.type(), new cv.Scalar(r + 1, g + 1, b + 1, 255));
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        cv.inRange(src, low, high, binaryThreshold);
        cv.findContours(binaryThreshold, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
        //DEBUG
        /*const dst: Mat = new cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
        cv.findContours(binaryThreshold, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
        meshes = [...meshes, ...generateGeometries(contours, hierarchy, src, [r,g,b], index)];

        // draw contours with random Scalar
        for (let i = 0; i < contours.size(); ++i) {
            const color = new cv.Scalar(
                Math.round(r),
                Math.round(g),
                Math.round(b)
            );
            cv.drawContours(dst, contours, i, color, 5, cv.LINE_8, hierarchy, 100);
        }
        cv.imshow(`canvasTest${index+1}`, dst);*/
        meshes = [...meshes, ...generateGeometries(contours, hierarchy, src, [r, g, b], index)];
        contours.delete();
        hierarchy.delete();
    });
    src.delete();
    return meshes;
}
// find all the colors in the image and run findcountours based on this colors
export function generateGeometriesByColorOccurance(imageDomId, precision = 0.05) {
    const src = cv.imread(imageDomId);
    const palette = computePalette("threshold", {
        image: src,
        precision: precision
    });
    return fromMatToGeometries(src, palette);
}
export function generateGeometriesByNumberOfColors(imageDomId, numberOfColors = 20) {
    const src = cv.imread(imageDomId);
    const image = document.getElementById(imageDomId);
    if (!image) {
        throw new Error(`Cannot find the element with the id '${imageDomId}'`);
    }
    debugger
    const palette = computePalette("quantification", {
        image: image,
        numberOfColors
    });
    const quantifiedImage = imageQuantified(src, palette);
    return fromMatToGeometries(quantifiedImage, palette);
}
