var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_pluginutils = require("@rollup/pluginutils");
var import_vite = require("vite");

// src/loadShader.js
var import_path = require("path");
var import_process = require("process");
var import_fs = require("fs");
var recursiveChunk = "";
var allChunks = /* @__PURE__ */ new Set();
var dependentChunks = /* @__PURE__ */ new Map();
var duplicatedChunks = /* @__PURE__ */ new Map();
var include = /#include(\s+([^\s<>]+));?/gi;
function resetSavedChunks() {
  const chunk = recursiveChunk;
  duplicatedChunks.clear();
  dependentChunks.clear();
  recursiveChunk = "";
  allChunks.clear();
  return chunk;
}
function getRecursionCaller() {
  const dependencies = [...dependentChunks.keys()];
  return dependencies[dependencies.length - 1];
}
function checkDuplicatedImports(path) {
  if (!allChunks.has(path))
    return;
  const caller = getRecursionCaller();
  const chunks = duplicatedChunks.get(caller) ?? [];
  if (chunks.includes(path))
    return;
  chunks.push(path);
  duplicatedChunks.set(caller, chunks);
  (0, import_process.emitWarning)(`'${path}' was included multiple times.`, {
    code: "vite-plugin-glsl",
    detail: `Please avoid multiple imports of the same chunk in order to avoid recursions and optimize your shader length.
Duplicated import found in file '${caller}'.`
  });
}
function removeSourceComments(source) {
  if (source.includes("/*") && source.includes("*/")) {
    source = source.slice(0, source.indexOf("/*")) + source.slice(source.indexOf("*/") + 2, source.length);
  }
  const lines = source.split("\n");
  for (let l = lines.length; l--; ) {
    if (lines[l].includes("//")) {
      lines[l] = lines[l].slice(0, lines[l].indexOf("//"));
    }
  }
  return lines.join("\n");
}
function checkRecursiveImports(path, warn) {
  warn && checkDuplicatedImports(path);
  return checkIncludedDependencies(path, path);
}
function checkIncludedDependencies(path, root) {
  const dependencies = dependentChunks.get(path);
  let recursiveDependency = false;
  if (dependencies == null ? void 0 : dependencies.includes(root)) {
    recursiveChunk = root;
    return true;
  }
  dependencies == null ? void 0 : dependencies.forEach(
    (dependency) => recursiveDependency ||= checkIncludedDependencies(dependency, root)
  );
  return recursiveDependency;
}
function compressShader(shader, newLine = false) {
  return shader.replace(/\\(?:\r\n|\n\r|\n|\r)|\/\*.*?\*\/|\/\/(?:\\(?:\r\n|\n\r|\n|\r)|[^\n\r])*/g, "").split(/\n+/).reduce((result, line) => {
    line = line.trim().replace(/\s{2,}|\t/, " ");
    if (/@(vertex|fragment)/.test(line))
      line += " ";
    if (line[0] === "#") {
      newLine && result.push("\n");
      result.push(line, "\n");
      newLine = false;
    } else {
      !line.startsWith("{") && result.length && result[result.length - 1].endsWith("else") && result.push(" ");
      result.push(line.replace(/\s*({|}|=|\*|,|\+|\/|>|<|&|\||\[|\]|\(|\)|\-|!|;)\s*/g, "$1"));
      newLine = true;
    }
    return result;
  }, []).join("").replace(/\n+/g, "\n");
}
function loadChunks(source, path, extension, warn, root) {
  const unixPath = path.split(import_path.sep).join(import_path.posix.sep);
  if (checkRecursiveImports(unixPath, warn)) {
    return recursiveChunk;
  }
  source = removeSourceComments(source);
  let directory = (0, import_path.dirname)(unixPath);
  allChunks.add(unixPath);
  if (include.test(source)) {
    dependentChunks.set(unixPath, []);
    const currentDirectory = directory;
    source = source.replace(include, (_, chunkPath) => {
      var _a;
      chunkPath = chunkPath.trim().replace(/^(?:"|')?|(?:"|')?;?$/gi, "");
      if (!chunkPath.indexOf("/")) {
        const base = (0, import_process.cwd)().split(import_path.sep).join(import_path.posix.sep);
        chunkPath = base + root + chunkPath;
      }
      const directoryIndex = chunkPath.lastIndexOf("/");
      directory = currentDirectory;
      if (directoryIndex !== -1) {
        directory = (0, import_path.resolve)(directory, chunkPath.slice(0, directoryIndex + 1));
        chunkPath = chunkPath.slice(directoryIndex + 1, chunkPath.length);
      }
      let shader = (0, import_path.resolve)(directory, chunkPath);
      if (!(0, import_path.extname)(shader))
        shader = `${shader}.${extension}`;
      const shaderPath = shader.split(import_path.sep).join(import_path.posix.sep);
      (_a = dependentChunks.get(unixPath)) == null ? void 0 : _a.push(shaderPath);
      return loadChunks(
        (0, import_fs.readFileSync)(shader, "utf8"),
        shader,
        extension,
        warn,
        root
      );
    });
  }
  if (recursiveChunk) {
    const caller = getRecursionCaller();
    const recursiveChunk2 = resetSavedChunks();
    throw new Error(
      `Recursion detected when importing '${recursiveChunk2}' in '${caller}'.`
    );
  }
  return source.trim().replace(/(\r\n|\r|\n){3,}/g, "$1\n");
}
function loadShader_default(source, shader, options) {
  const {
    warnDuplicatedImports,
    defaultExtension,
    compress,
    root
  } = options;
  resetSavedChunks();
  const output = loadChunks(
    source,
    shader,
    defaultExtension,
    warnDuplicatedImports,
    root
  );
  return {
    dependentChunks,
    outputShader: compress ? typeof compress !== "function" ? compressShader(output) : compress(output) : output
  };
}

// src/index.js
var import_promises = __toESM(require("fs/promises"), 1);
var msd = import("webgpu-utils");
var DEFAULT_EXTENSION = "glsl";
var DEFAULT_SHADERS = Object.freeze([
  "**/*.wgsl"
]);
function src_default({
  include: include2 = DEFAULT_SHADERS,
  exclude = void 0,
  warnDuplicatedImports = true,
  defaultExtension = DEFAULT_EXTENSION,
  compress = false,
  watch = true,
  root = "/"
} = {}) {
  let server = void 0, config = void 0;
  const filter = (0, import_pluginutils.createFilter)(include2, exclude);
  const prod = process.env.NODE_ENV === "production";
  return {
    enforce: "pre",
    name: "vite-plugin-glsl",
    configureServer(devServer) {
      server = devServer;
    },
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    async transform(source, shader) {
      if (!filter(shader))
        return;
      globalThis.GPUShaderStage = {
        VERTEX: 1,
        FRAGMENT: 2,
        COMPUTE: 4
      };
      const { dependentChunks: dependentChunks2, outputShader } = loadShader_default(source, shader, {
        warnDuplicatedImports,
        defaultExtension,
        compress,
        root
      });
      const { moduleGraph } = server ?? {};
      const module2 = moduleGraph == null ? void 0 : moduleGraph.getModuleById(shader);
      const chunks = Array.from(dependentChunks2.values()).flat();
      if (watch && module2 && !prod) {
        if (!chunks.length)
          module2.isSelfAccepting = true;
        else {
          const imported = /* @__PURE__ */ new Set();
          chunks.forEach((chunk) => imported.add(
            moduleGraph.createFileOnlyEntry(chunk)
          ));
          moduleGraph.updateModuleInfo(
            module2,
            imported,
            null,
            /* @__PURE__ */ new Set(),
            null,
            true
          );
        }
      }
      const makeShaderDataDefinitions = (await msd).makeShaderDataDefinitions;
      const result = await (0, import_vite.transformWithEsbuild)(outputShader, shader, {
        sourcemap: config.build.sourcemap && "external",
        loader: "text",
        format: "esm",
        minifyWhitespace: prod
      });
      const definitions = makeShaderDataDefinitions(result.map.sourcesContent[0].replace(/(^|\s)override/g, "const"));
      await import_promises.default.writeFile("./test.txt", JSON.stringify({ code: result.map.sourcesContent[0], definitions }, null, 2));
      return {
        code: `export const code = \`${result.map.sourcesContent[0]}\`;

export const definitions = \`${JSON.stringify(definitions)}\`;

export default code`,
        map: null,
        data: {
          code: result.map.sourcesContent[0],
          definitions
        }
      };
    }
  };
}
/**
 * @module vite-plugin-glsl
 * @author Ustym Ukhman <ustym.ukhman@gmail.com>
 * @description Import, inline (and compress) GLSL shader files
 * @version 1.2.1
 * @license MIT
 */
