/*function distance([x1, y1, z1, a1]: pixel, [x2, y2, z2, a2]: pixel): number {
  const deltaR = (x1 - x2);
  const deltaG = (y1 - y2);
  const deltaB = (z1 - z2);
  const deltaA = (a1 - a2);

  const rgbDistanceSquared = (deltaR * deltaR + deltaG * deltaG + deltaB * deltaB) / 3.0;
  return deltaA * deltaA / 2.0 + rgbDistanceSquared * a1 * a2 / (255 * 255);
}


function findNearestColor(pixel: pixel, palette: pixel[]) : pixel {
  let nearestColor: pixel = [0,0,0,0];
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

function imageQuantified(image: HTMLImageElement, paletteSize: number) : Mat {
  const palette = generateColorPalette(image, paletteSize);
  const src = cv.imread(image);
  const target = new cv.Mat.zeros(src.rows, src.cols, cv. CV_8UC4);
  const channels = target.channels();
  const { cols, rows } = target;

  for(let x = 0; x < cols; x++) {
    for(let y = 0; y < rows; y++) {
      const [R, G, B, A] = findNearestColor(getColor(src, x,y), palette);
      target.data[y * cols * channels + x * channels] = R;
      target.data[y * cols * channels + x * channels + 1] = G;
      target.data[y * cols * channels + x * channels + 2] = B;
      target.data[y * cols * channels + x * channels + 3] = A;
    }
  }
  return target;
}
*/