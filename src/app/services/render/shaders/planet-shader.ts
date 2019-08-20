export const PLANET_VS_SOURCE = `#version 300 es

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


export const PLANET_FS_SOURCE = `#version 300 es
precision mediump float;
out vec4 fragColor;
in vec3 coord;
uniform vec3 color;

uniform vec2 starPosition;

void main() {

    float f = dot(starPosition, coord.xy)/2.0;

    float l = length(coord.xy)/2.0;
    if(l > 0.5)
        discard;

    float a = 1.1 - l*l*4.0;
    if(l>0.35){

        fragColor = vec4(vec3(0.7,1.5,1.5),(f*2.0+0.3)*a*a*a);
    }else{
        fragColor = vec4(color*vec3(f+0.1,f+0.1,f+0.1), 1.0)*vec4(vec3(a*a*a),1.0);
    }


}
`;
