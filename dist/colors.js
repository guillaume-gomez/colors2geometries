export function getColorRGB(image, x, y) {
    const { data, cols } = image;
    const channels = image.channels();
    const R = data[y * cols * channels + x * channels];
    const G = data[y * cols * channels + x * channels + 1];
    const B = data[y * cols * channels + x * channels + 2];
    return [R, G, B];
}
export function getColorRGBA(image, x, y) {
    const { data, cols } = image;
    const channels = image.channels();
    const R = data[y * cols * channels + x * channels];
    const G = data[y * cols * channels + x * channels + 1];
    const B = data[y * cols * channels + x * channels + 2];
    const A = data[y * cols * channels + x * channels + 3];
    return [R, G, B, A];
}
export function distance([x1, y1, z1, a1], [x2, y2, z2, a2]) {
    const deltaR = (x1 - x2);
    const deltaG = (y1 - y2);
    const deltaB = (z1 - z2);
    const deltaA = (a1 - a2);
    const rgbDistanceSquared = (deltaR * deltaR + deltaG * deltaG + deltaB * deltaB) / 3.0;
    return deltaA * deltaA / 2.0 + rgbDistanceSquared * a1 * a2 / (255 * 255);
}
