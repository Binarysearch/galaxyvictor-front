export const HOVER_VS_SOURCE = `#version 300 es

in vec2 position;

uniform vec2 pos;
uniform float scale;
uniform float zoom;
uniform float aspect;

out vec3 coord;

void main() {
    vec2 p = position*scale + pos*zoom;
    p.x /= aspect;
    coord = vec3(position,zoom);
    gl_Position = vec4(p, 0.0, 1.0);
}
`;


export const HOVER_FS_SOURCE = `#version 300 es
precision mediump float;
out vec4 fragColor;
in vec3 coord;
uniform vec3 color;

uniform float time;

void main() {
    float vC = 1.0;
    float l = length(coord.xy)/2.0;
    if(l > 0.5)
        discard;

    if(l>0.4){
        vec2 r = vec2(coord.x*cos(time),coord.y*sin(time));
        float a1 = max(vC*r.x+vC*r.y,0.0) + max(-vC*r.x-vC*r.y,0.0);

        float fd = (0.5 - l)*10.0;
        fragColor = vec4(color, a1 * fd);
    }else if(l > 0.5){
        discard;
    }else{
        float cambio = max(cos(-time+l*80.0),0.0);
        float a = 1.0 - l*2.0;
        fragColor = vec4(1.0, 1.0, 1.0, (cambio*a/5.0 + a/5.0)*a);
    }
}
`;
