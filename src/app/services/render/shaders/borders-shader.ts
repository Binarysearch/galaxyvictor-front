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


float getFloatValue(vec4 v) {
    return 2.0 *
        ((v.r * 256.0 * 256.0 * 256.0 * 255.0 +
        v.g * 256.0 * 256.0 * 255.0 +
        v.b * 256.0 * 255.0 +
        v.a * 255.0) / (256.0 * 256.0 * 256.0 * 256.0)) - 1.0;
}

float getValue() {
    float x = 60000.0 * getFloatValue(texelFetch(uSampler, ivec2(0, 0), 0));
    return length(coord.xy - vec2(x, 0.0));
}

void main() {
    float r = getValue();
    for(int i =0;i<100000;i++){
        r = getValue();
    }
    fragColor = vec4(r, 0.0, 0.0, 1.0);
}
`;
