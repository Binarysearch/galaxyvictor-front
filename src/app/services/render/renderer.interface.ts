import { Camera } from './camera';

export interface RenderContext {
    gl: WebGLRenderingContext;
    camera: Camera;
    aspectRatio: number;
}

export interface Entity {
    id: string;
    x: number;
    y: number;
}

export interface Renderer {
    setup(context: RenderContext): void;
    prepare(context: RenderContext): void;
    render(entities: Entity[], context: RenderContext): void;
    getRenderScale(entity: Entity, zoom: number): number;
}