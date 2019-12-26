export const COLONY_VS_SOURCE = `#version 300 es

in vec2 position;

uniform vec2 pos;
uniform float scale;
uniform float zoom;
uniform float aspect;

out vec3 coord;

void main() {
    vec2 p = position*scale + pos;
    p.x /= aspect;
    coord = vec3(position,zoom);
    gl_Position = vec4(p*zoom, 0.0, 1.0);
}
`;


export const COLONY_FS_SOURCE = `#version 300 es
precision mediump float;
out vec4 fragColor;
in vec3 coord;
uniform vec3 color;

uniform float time;

void main() {
    float vC = 1.0;
    float l = length(coord.xy)/2.0;
    if(l > 0.5 || l < 0.3)
        discard;

    float a = (0.5 - l) * (0.5 - l) * 5.0;

    fragColor = vec4(color, a);
}
`;