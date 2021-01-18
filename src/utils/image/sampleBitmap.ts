/**
 * Samples the specified section of the source Bitmap and draws it in to the target Bitmap.
 *
 * @param {Bitmap} target Bitmap object to draw sample to
 * @param {Bitmap} source Bitmap object to sample from
 * @param {Rect} sampleRect Rect that defines what area of the source image to draw
 * @returns {Bitmap}
 */
export default function sampleBitmap(target: Bitmap, source: Bitmap, sampleRect: Rect): Bitmap {
	source.addLoadListener(() => {
		target.blt(source, sampleRect.x, sampleRect.y, sampleRect.width, sampleRect.height, 0, 0);
	});

	return target;
}