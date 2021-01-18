/**
 * Retrieves Bitmap from source folder.
 *
 * @param {string} filename Name of image file to retrieve
 * @param {string} [path=system] Folder path from inside project's img folder, defaults to "system"
 * @param {number} [hue] Hue value for the image
 * @returns {Bitmap}
 */
export default function getImage(filename: string, path: string, hue?: number): Bitmap {
	path = path || "system";

	// No filename passed, return null
	if (!filename) {
		return null;
	}

	// Use the correct icon set
	return ImageManager.loadBitmap("img/" + path + "/", filename, hue, true);
}