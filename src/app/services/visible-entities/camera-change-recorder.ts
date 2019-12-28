import { Camera } from '../render/camera';

export class CameraChangeRecorder {

    private oldCameraCoords: { x: number; y: number; zoom: number; };
    
    constructor(
        private camera: Camera
    ) {
        this.oldCameraCoords = {
            x: this.camera.x,
            y: this.camera.y,
            zoom: this.camera.zoom
        }
    }

    public changed(): boolean {
        const changeX = Math.abs(this.oldCameraCoords.x - this.camera.x) * this.camera.zoom;
        const changeY = Math.abs(this.oldCameraCoords.y - this.camera.y) * this.camera.zoom;
        const changeZ = this.oldCameraCoords.zoom / this.camera.zoom;
        const result = changeX > 1 || changeY > 1 || changeZ > 1.5 || changeZ < 0.75;
    
        if (result) {
          this.oldCameraCoords = {
            x: this.camera.x,
            y: this.camera.y,
            zoom: this.camera.zoom
          }
        }
        return result;
    }
}