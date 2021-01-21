const path = require("path");
const glob = require("glob");

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const PluginDocsPlugin = require("./docs");
const nodeExternals = require("webpack-node-externals");

// Build dynamic Webpack entry points.
const entryMap = {};
glob.sync("./src/**/index.ts")
	.forEach((filename) => {
		const key = filename.replace(/.\/src\//, "")
			.replace(/\/index.ts/, "");

		entryMap[key] = filename;

		return entryMap;
	});

const config = {
    mode: "development",
    entry: entryMap,
    output: {
        path: path.resolve(__dirname, "../plugins"),
        filename: "[name].js",
	},
	plugins: [new PluginDocsPlugin()],
    target: "node",
    externals: [nodeExternals()],
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.resolve(__dirname, "../tsconfig.json"),
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

// Don't worry about source maps in production.
if (config.mode !== "production") {
	config.devtool = "inline-source-map";
}

module.exports = config;