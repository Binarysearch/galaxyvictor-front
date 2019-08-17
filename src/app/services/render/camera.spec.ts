import { Camera } from './camera';

describe('Camera', () => {

  it('should create an instance', () => {
    expect(new Camera()).toBeTruthy();
  });

  it('should augment zoom on zoomIn', () => {
    let camera = new Camera();

    let initialZoom = camera.zoom;

    camera.zoomIn(1, 1);

    camera.update();

    expect(camera.zoom).toBeGreaterThan(initialZoom);
  });

  it('should decrease zoom on zoomOut', () => {
    let camera = new Camera();
    camera.zoom = 1;

    let initialZoom = camera.zoom;

    camera.zoomOut(1, 1);

    camera.update();

    expect(initialZoom).toBeGreaterThan(camera.zoom);
  });

});
