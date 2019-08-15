export const STAR_SYSTEM_VS_SOURCE = `#version 300 es

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


export const STAR_SYSTEM_FS_SOURCE = `#version 300 es
precision mediump float;
out vec4 fragColor;
in vec3 coord;
uniform vec3 color;

uniform float time;

void main() {
    float vC = min(coord.z/0.001,1.0);
    float l = length(coord.xy)/2.0;

    if(l > 0.4){
        discard;
    }else{
        float a = 1.0 - l*2.0;
        float f = 1.0 - l*3.5;
        float d = abs(a*a*a/(coord.x)) + abs(a*a*a/(coord.y));


        float s = f*f*f*f*f*10.0 + min(d/100.0,0.2);
        fragColor = vec4(s,s,s,(s + a/5.0)*a) + mix(vec4(color,0.0), vec4(1.0,1.0,1.0,0.0), 1.0-vC);
        return;
    }
}
`;
