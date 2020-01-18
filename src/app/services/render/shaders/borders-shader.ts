export const BORDERS_VS_SOURCE = `#version 300 es

in vec2 position;
in vec4 v_color;

uniform vec2 pos;
uniform float zoom;
uniform float aspect;

out vec4 color;

void main() {
    vec2 p = position + pos;
    p.x /= aspect;
    color = v_color;
    gl_Position = vec4(p*zoom, 0.0, 1.0);
}
`;


export const BORDERS_FS_SOURCE = `#version 300 es
precision mediump float;
out vec4 fragColor;
in vec4 color;


void main() {
    fragColor = color;
}
`;
