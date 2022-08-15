import cv, { Mat } from "opencv-ts";
import { computePalette } from "./palette";
import { distance, pixelRGBA, getColorRGBA } from "./colors";

function findNearestColor(pixel: pixelRGBA, palette: pixelRGBA[]) : pixelRGBA {
  let nearestColor: pixelRGBA = [0,0,0,0];
  let nearestDistance = distance([0, 0, 0, 0], [255, 255, 255, 255]);
  palette.forEach(color => {
    const currentDistance = distance(color, pixel)
    if(nearestDistance > currentDistance) {
      nearestDistance = currentDistance;
      nearestColor = color;
    }
  });
  return nearestColor;
}

export function imageQuantified(image: Mat, palette: pixelRGBA[]) : Mat {
  const target = new cv.Mat.zeros(image.rows, image.cols, cv.CV_8UC4);
  const channels = target.channels();
  const { cols, rows } = target;

  for(let x = 0; x < cols; x++) {
    for(let y = 0; y < rows; y++) {
      const [R, G, B, A] = findNearestColor(getColorRGBA(image, x,y), palette);
      target.data[y * cols * channels + x * channels]     = R;
      target.data[y * cols * channels + x * channels + 1] = G;
      target.data[y * cols * channels + x * channels + 2] = B;
      target.data[y * cols * channels + x * channels + 3] = A;
    }
  }
  return target;
}