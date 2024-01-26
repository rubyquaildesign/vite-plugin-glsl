/**
 * @module vite-plugin-glsl
 * @author Ustym Ukhman <ustym.ukhman@gmail.com>
 * @description Import, inline (and compress) GLSL shader files
 * @version 1.2.1
 * @license MIT
 */
import type { PluginOptions } from './types.d';
import type { Plugin, ViteDevServer } from 'vite';
import loadShader from './loadShader.js';
import * as  msd from 'webgpu-utils';
import { createFilter } from '@rollup/pluginutils';
/**
 * @const
 * @default
 * @readonly
 * @type {string}
 */
const DEFAULT_EXTENSION = 'glsl';

/**
 * @const
 * @default
 * @readonly
 * @type {readonly RegExp[]}
 */
const DEFAULT_SHADERS = Object.freeze([
  '**/*.wgsl',
]) as string[];

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
export default function ({
    include = DEFAULT_SHADERS,
    exclude = undefined,
    warnDuplicatedImports = true,
    defaultExtension = DEFAULT_EXTENSION,
    compress = false,
    watch = true,
    root = '/'
  }: PluginOptions = {}
): Plugin {
  let server: ViteDevServer | undefined = undefined, config = undefined;
  const prod = process.env.NODE_ENV === 'production';
  const filter = createFilter(include, exclude);
  
  return ({
    enforce: 'pre',
    name: 'vite-plugin-glsl',

    configureServer (devServer) {
      server = devServer;
    },

    configResolved (resolvedConfig) {
      config = resolvedConfig;
    },

    transform(source, shader) {
      if (!filter(shader)) return;
      (globalThis as any).GPUShaderStage = {
        VERTEX: 1,
        FRAGMENT: 2,
        COMPUTE: 4,
      }
      const { dependentChunks, outputShader } = loadShader(source, shader, {
        warnDuplicatedImports,
        defaultExtension,
        compress,
        root
      } as any);

      const { moduleGraph } = server ?? {};
      const module = moduleGraph?.getModuleById(shader);
      const chunks = Array.from(dependentChunks.values()).flat();

      if (watch && module && !prod) {
        if (!chunks.length) module.isSelfAccepting = true;

        else {
          const imported = new Set();

          chunks.forEach(chunk => imported.add(
            moduleGraph!.createFileOnlyEntry(chunk)
          ));

          moduleGraph!.updateModuleInfo(
            module, imported as any, null,
            new Set(), null, true
          );
        }
      }
      const makeShaderDataDefinitions = msd.makeShaderDataDefinitions;
      const definitions = makeShaderDataDefinitions(outputShader.replace(/(^|\s)override/g,'const'));
      return {
        code: `export const code = \`${outputShader}\`;\n\nexport const definitions = \`${JSON.stringify(definitions)}\`;\n\nexport default code`, map: null, data: {
        code:outputShader,definitions
      }};
    }
  });
}
