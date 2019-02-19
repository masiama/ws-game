const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const fs = require('fs');

const nodeModules = {};
fs.readdirSync('node_modules')
	.filter(x => ['.bin'].indexOf(x) === -1)
	.forEach(mod => nodeModules[mod] = 'commonjs ' + mod);

const common = argv => ({
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
		],
	},
	optimization: {
		usedExports: true
	},
	mode: argv.mode || 'development',
});
const commonPluggins = [new TerserPlugin()];
module.exports = (_, argv) => ([{
	entry: './src/client',
	output: {
		path: path.resolve(__dirname, 'out'),
		filename: 'client.js',
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/client/index.html',
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeScriptTypeAttributes: true,
			},
		}),
		...commonPluggins
	],
	...common(argv)
}, {
	entry: './src/server',
	target: 'node',
	output: {
		path: path.resolve(__dirname, 'out'),
		filename: 'server.js',
	},
	externals: nodeModules,
	plugins: [...commonPluggins],
	...common(argv)
}]);
