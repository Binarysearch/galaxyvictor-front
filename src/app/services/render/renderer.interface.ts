import { Camera } from './camera.class';

export interface RenderContext {
    gl: WebGLRenderingContext;
    camera: Camera;
    aspectRatio: number;
}

export interface Entity {

}

export interface Renderer {
    setup(context: RenderContext): void;
    prepare(context: RenderContext): void;
    render(entities: Entity[], context: RenderContext): void;
}