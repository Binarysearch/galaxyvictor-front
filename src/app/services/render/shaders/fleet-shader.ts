export const FLEET_VS_SOURCE = `#version 300 es

in vec2 position;

uniform vec2 pos;
uniform float scale;
uniform float zoom;
uniform float aspect;
uniform float angle;

void main() {
    vec2 position2 = mat2(cos(angle),-sin(angle),sin(angle),cos(angle)) * position;
    vec2 p = position2*scale + pos;
    p.x /= aspect;

    gl_Position = vec4(p*zoom, 0.0, 1.0);
}
`;


export const FLEET_FS_SOURCE = `#version 300 es
precision mediump float;
out vec4 fragColor;

uniform vec3 color;

void main() {
    fragColor = vec4(color, 1.0);
}
`;
