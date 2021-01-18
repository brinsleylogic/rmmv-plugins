import getImage from "./getImage";
import sampleBitmap from "./sampleBitmap";

/**
 * Loads source image from folder in to Bitmap object.
 *
 * @param {Bitmap} bitmap Bitmap to draw image in to
 * @param {Rect} sampleRect Rect that defines what area of the source image to draw
 * @param {string} filename Name of image file to retrieve
 * @param {string} [filePath=system] Folder path from inside project's img folder, defaults to "system"
 * @param {number} [hue] Hue value for the image
 * @returns {Bitmap}
 */
export default function drawImageToBitmap(bitmap: Bitmap, sampleRect: Rect, filename: string, filePath?: string, hue?: number): Bitmap {
	// Ensure we have a target Bitmap
	bitmap = bitmap || new Bitmap(sampleRect.width, sampleRect.height);

	// Retrieve source image
	const sourceImage = getImage(filename, filePath, hue);

	return sampleBitmap(bitmap, sourceImage, sampleRect);
}