const path = require("path");
const glob = require("glob");

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

// Build dynamic Webpack entry points.
const entryMap = {};
glob.sync("./src/**/index.ts")
	.forEach((filename) => {
		const key = filename.replace(/.\/src\//, "SRCrazy_")
			.replace(/\/index.ts/, "");

		entryMap[key] = filename;

		return entryMap;
	});

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: entryMap,
    output: {
        path: path.resolve(__dirname, "plugins"),
        filename: "[name].js",
    },
    target: "node",
    externals: [nodeExternals()],
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.resolve(__dirname, "./tsconfig.json"),
                extensions: [".ts", ".tsx"]
            })
        ],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
        ],
    }
};