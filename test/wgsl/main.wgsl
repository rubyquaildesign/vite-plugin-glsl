#include /test/wgsl/chunk0.wgsl;

struct OutputData {
  gars: f32,
  frags: i32,
}
override blue = 12;
@group(0) @binding(2) var<storage,read_write> fgg: array<OutputData,blue>;
@vertex
fn mainVert(@builtin(vertex_index) index: u32) -> @builtin(position) vec4f {
    let position = array(
        vec2f(0.0, 1.0),
        vec2f(1.0, 1.0),
        vec2f(0.0, 0.0),
        vec2f(0.0, 0.0),
        vec2f(1.0, 0.0),
        vec2f(1.0, 1.0)
    );

    let coords = position[index];
    return vec4f(coords * 2 - 1, 0, 1);
}

@fragment
fn mainFrag() -> @location(0) vec4f {
    return chunkFn();
}
