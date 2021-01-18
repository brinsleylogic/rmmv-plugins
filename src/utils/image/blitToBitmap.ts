import drawImageToBitmap from "./drawImageToBitmap";

/**
 * Draws section of source image to Bitmap object based on a uniform spacing index.
 *
 * @param {Bitmap} bitmap Bitmap to draw image in to
 * @param {number} index Index of image in source
 * @param {string} filename Name of image file to retrieve
 * @param {string} [filePath=system] Folder path from inside project's img folder, defaults to "system"
 * @param {number} [hue] Hue value for the image
 */
export default function blitToBitmap(bitmap: Bitmap, index: number, filename: string, filePath: string, hue?: number): void {
	const w = bitmap.canvas.width;
	const h = bitmap.canvas.height;

	// Get position of target in source image
	const drawRect: Rect = {
		x: (index % 16) * w,
		y: Math.floor(index / 16) * h,
		width: w,
		height: h
	};

	drawImageToBitmap(bitmap, drawRect, filename, filePath, hue);
}