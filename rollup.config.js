import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';

export default {
	input: 'src/client/index.js',
	output: {
		file: 'out/client.js',
		format: 'esm'
	},
	plugins: [
		babel({ babelHelpers: 'bundled' }),
		terser(),
	]
};
