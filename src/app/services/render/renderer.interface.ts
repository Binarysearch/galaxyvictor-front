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

export interface Segment {
    id: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export interface Renderer {
    setup(context: RenderContext): void;
    prepare(context: RenderContext): void;
    render(entities: Entity[], context: RenderContext): void;
    getRenderScale(entity: Entity, zoom: number): number;
}

export interface SegmentRenderer {
    setup(context: RenderContext): void;
    prepare(context: RenderContext): void;
    render(segments: Segment[], context: RenderContext): void;
}
