/**
 * Returns typed value from supplied string.
 *
 * @param {string} value String value to be typed.
 * @returns {string | number | boolean}
 */
export default function getTypedValue(value: string): any {
	switch (value.toLowerCase()) {
		case "no":
		case "off":
		case "false":
			return false;

		case "yes":
		case "on":
		case "true":
			return true;

		default:
			const numeric = value.match(/0x[0-9a-f]+|\#\w+|\d+\.\d+|\d+/);

			if (!numeric) {
				return value;
			}

			let num: number;

			if (value[1] === "x" || value[0] === "#") {
				num = parseInt(value, 16);
			} else {
				num = Number(value);
			}

			if (!isNaN(num) && isFinite(num)) {
				return num;
			}

			return value;
	}
}