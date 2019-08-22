export const SEGMENT_VS_SOURCE = `#version 300 es

in vec2 position;

uniform vec4 pos;
uniform float zoom;
uniform float aspect;

void main() {
    float x = (position.x + 1.0) * pos.x + abs(position.x - 1.0) * pos.z;
    float y = (position.y + 1.0) * pos.y + abs(position.y - 1.0) * pos.w;
    vec2 p = vec2(x, y) / 2.0;
    p.x /= aspect;

    gl_Position = vec4(p*zoom, 0.0, 1.0);
}
`;


export const SEGMENT_FS_SOURCE = `#version 300 es
precision mediump float;
out vec4 fragColor;

uniform vec4 color;

void main() {
    fragColor = color;
}
`;
