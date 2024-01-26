export type FieldDefinition = {
  offset: number;
  type: TypeDefinition;
};
type FieldDefinitions = {
  [x: string]: FieldDefinition;
};
type TypeDefinition = {
  size: number;
};
type StructDefinition = TypeDefinition & {
  fields: FieldDefinitions;
  size: number;
};
type Resource = {
  name: string;
  group: number;
  entry: GPUBindGroupLayoutEntry;
};
type EntryPoint = {
  stage: GPUShaderStageFlags;
  resources: Resource[];
};
type EntryPoints = {
  [x: string]: EntryPoint;
};

type VariableDefinitions = {
  [x: string]: VariableDefinition;
};
type ShaderDataDefinitions = {
  uniforms: VariableDefinitions;
  storages: VariableDefinitions;
  structs: StructDefinitions;
  entryPoints: EntryPoints;
};
export type StructDefinitions = {
  [x: string]: StructDefinition;
};

/**
 * @const
 * @readonly
 * @kind module
 * @description Generic shaders
 */
declare module '*.glsl' {
  const shader: string;
  export default shader;
}

/**
 * @const
 * @readonly
 * @kind module
 * @description WebGPU shaders
 */
declare module '*.wgsl' {
  export const code: string;
  export const definitions: ShaderDataDefinitions;
  export default code;
}

/**
 * @const
 * @readonly
 * @kind module
 * @description Vertex shaders
 */
declare module '*.vert' {
  const shader: string;
  export default shader;
}

/**
 * @const
 * @readonly
 * @kind module
 * @description Fragment shaders
 */
declare module '*.frag' {
  const shader: string;
  export default shader;
}

/**
 * @const
 * @readonly
 * @kind module
 * @description Vertex shaders
 */
declare module '*.vs' {
  const shader: string;
  export default shader;
}

/**
 * @const
 * @readonly
 * @kind module
 * @description Fragment shaders
 */
declare module '*.fs' {
  const shader: string;
  export default shader;
}
