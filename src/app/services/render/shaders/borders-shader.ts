export const BORDERS_VS_SOURCE = `#version 300 es

in vec2 position;

uniform vec2 pos;
uniform float zoom;
uniform float aspect;

out vec2 coord;

void main() {
    vec2 p = position + pos;
    p.x /= aspect;
    coord = position;
    gl_Position = vec4(p*zoom, 0.0, 1.0);
}
`;


export const BORDERS_FS_SOURCE = `#version 300 es
precision highp float;
out vec4 fragColor;
in vec2 coord;

uniform sampler2D uSampler;
uniform int colonyCount;
uniform float time;

ivec2 texcoordFromIndex(int ndx, ivec2 size) {
    int column = ndx % size.x;
    int row = ndx / size.x;
    return ivec2(column, row);
}

float getValue() {
    float value = 0.0;
    ivec2 size = textureSize(uSampler, 0);
  
    for(int i=0;i<colonyCount;i++) {
        ivec2 idx = texcoordFromIndex(i, size);
        vec4 tx = texelFetch(uSampler, idx, 0);
        float x = coord.x - tx.r;
        float y = coord.y - tx.g;
        float r = tx.b;
        value = value + (r * r) / (x * x + y * y);
    }
  
    return value;
}

void main() {
    float v = getValue();

    float a = min(v / 20.0, 0.7);

    fragColor = vec4(1.0, 1.0, 0.0, pow(a, 4.0));
}
`;
