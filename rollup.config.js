import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
export default {
	input: 'src/index.ts',
	output: [{
		format: 'esm',
		file: 'output/index.mjs',
		inlineDynamicImports:true,
	},{format:'cjs',file: 'output/index.cjs',
	inlineDynamicImports:true,}],
	plugins: [nodeResolve(),typescript()],

	external: ['picomatch'],

};
