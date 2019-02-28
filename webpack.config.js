const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const fs = require('fs');

const nodeModules = {};
fs.readdirSync('node_modules')
	.filter(x => ['.bin'].indexOf(x) === -1)
	.forEach(mod => nodeModules[mod] = 'commonjs ' + mod);

module.exports = {
	entry: './src/server',
	target: 'node',
	output: {
		path: path.resolve(__dirname, 'out'),
		filename: 'server.js',
	},
	externals: nodeModules,
	plugins: [new TerserPlugin()],
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
		],
	},
	optimization: {
		usedExports: true
	},
	mode: 'development',
};
