/**
 * @module vite-plugin-glsl
 * @author Ustym Ukhman <ustym.ukhman@gmail.com>
 * @description Import, inline (and compress) GLSL shader files
 * @version 1.2.1
 * @license MIT
 */
import type { PluginOptions } from './types.d';
import type { Plugin } from 'vite';
/**
 * @function
 * @name glsl
 * @description Plugin entry point to import,
 * inline, (and compress) GLSL shader files
 *
 * @see {@link https://vitejs.dev/guide/api-plugin.html}
 * @link https://github.com/UstymUkhman/vite-plugin-glsl
 *
 * @param {PluginOptions} options Plugin config object
 *
 * @returns {Plugin} Vite plugin that converts shader code
 */
export default function ({ include, exclude, warnDuplicatedImports, defaultExtension, compress, watch, root }?: PluginOptions): Plugin;
