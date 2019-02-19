var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
	.filter(x => ['.bin'].indexOf(x) === -1)
	.forEach(mod => nodeModules[mod] = 'commonjs ' + mod);

module.exports = (_, argv) => ([{
	entry: './src/client',
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
			template: 'src/client/index.html',
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeScriptTypeAttributes: true,
			},
		}),
	],
	mode: argv.mode || 'development',
}, {
	entry: './src/server',
	target: 'node',
	output: {
		path: path.resolve(__dirname, 'out'),
		filename: 'server.js',
	},
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
		],
	},
	externals: nodeModules,
	mode: argv.mode || 'development',
}]);
