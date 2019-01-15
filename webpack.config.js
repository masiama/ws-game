var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (_, argv) => ({
	entry: './client.js',
	output: {
		path: path.resolve(__dirname, 'out'),
		filename: 'client.js',
	},
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'index.html',
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeScriptTypeAttributes: true,
			},
		}),
	],
	mode: argv.mode || 'development',
});
