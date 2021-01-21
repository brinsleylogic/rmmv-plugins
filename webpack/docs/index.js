const fs = require("fs");

class PluginDocsPlugin {
	apply(compiler) {
		compiler.hooks.emit.tap("PluginDocsPlugin", (compilation) => {
			const fileNames = Object.keys(compilation.assets);

			let i = fileNames.length;

			while (i-- > 0) {
				const key = fileNames[i];
				const asset = compilation.assets[key];

				const docPath = `src/${key.substr(0, key.length - 3)}/docs.js`;

				if (!fs.existsSync(docPath)) {
					continue;
				}

				const docs = fs.readFileSync(docPath).toString();
				const source = getSourceFromAsset(asset);

				if (source._value == null) {
					continue;
				}

				const content = source._value;

				if (content._valueIsBuffer) {
					source._value = Buffer.from(docs + content, "utf8");
				} else {
					source._value = docs + content;
				}
			}
		});
	}
}

function getSourceFromAsset(asset) {
	if (asset._children) {
		return getSourceFromAsset(asset._children[0]);
	}

	if (asset._value) {
		return asset;
	}
}

module.exports = PluginDocsPlugin;