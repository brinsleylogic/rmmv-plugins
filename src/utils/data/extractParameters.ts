import getTypedValue from "./getTypedValue";

/**
 * Extracts (and strongly types) parameters from supplied string.
 *
 * @param {string} paramString The parameter string.
 * @returns {*} Parsed parameter data.
 */
export default function extractParameters(paramString: string): any {
	const structure = paramString.match(/(>)|(<)/gi);
	const hierarchy = [];

	let structureIndex = 0;

	const params = paramString.match(/<!?([\w\s]+):?/gi);
	const data = {};

	let target = data;
	let original = paramString;

	for (let i = 0, l = params.length; i < l; i++) {
		var endChar = structure[++structureIndex];
		var waitingForClosure = (endChar === ">");
		var closureTag = "";

		// Grab the parameter name.
		let key = params[i].replace(/[<:]/gi, "");
		let value: any;

		// We're closing this paramter, do the assignment.
		if (waitingForClosure) {
			// This is a boolean tag: false.
			if (key.indexOf("!") === 0) {
				key = key.substr(1, key.length);
				value = "";
				target[key] = false;

			// This is a boolean tag: true.
			} else if (params[i].indexOf(":") < 0) {
				target[key] = true;
				value = "";

			// Tag has a value set.
			} else {
				// Get the value.
				value = paramString.substring(
					params[i].length,
					paramString.indexOf( (waitingForClosure) ? ">" : "<")
				);

				target[key] = getTypedValue(value);
			}

			// We're closing this object, remove from hierarchy.
			while (structure[++structureIndex] === ">") {
				target = hierarchy.pop();
				closureTag += ">";
			}

		// We're opening a new object.
		} else {
			var newObject = {};
			target[key] = newObject;
			hierarchy.push(target);

			target = newObject;
		}

		// Remove processed data from string.
		var search = params[i];
		if (waitingForClosure) {
			search += value + ">";
		}

		paramString = paramString.replace(search + closureTag, "");
	}

	if (paramString) {
		console.warn("Game_Event.getCommentParameter :: Malformatted parameters:", original, data);
	}

	return data;
}