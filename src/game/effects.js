export class Effects {
  constructor(scene) {
    this.scene = scene;
    this.emitter = scene.add
      .particles(0, 0, 'spark', {
        emitting: false,
        lifespan: 520,
        speed: { min: 25, max: 130 },
        scale: { start: 0.7, end: 0 },
        alpha: { start: 0.85, end: 0 },
        gravityY: 75,
        maxParticles: 160,
        blendMode: 'ADD',
      })
      .setDepth(30);
  }
  burst(left, top, color = 0x8ee0d3, count = 12, speed = 130) {
    if (this.scene.app.store.data.settings.reducedMotion) count = Math.min(count, 4);
    this.emitter.setParticleTint(color);
    this.emitter.setParticleSpeed(speed * 0.35, speed);
    this.emitter.explode(count, left, top);
  }
  shake(intensity, duration) {
    const settings = this.scene.app.store.data.settings;
    if (settings.shake && !settings.reducedMotion)
      this.scene.cameras.main.shake(duration, intensity);
  }
  ring(left, top, color = 0x8ee0d3) {
    const ring = this.scene.add.circle(left, top, 14).setStrokeStyle(2, color, 0.8).setDepth(25);
    this.scene.tweens.add({
      targets: ring,
      scale: 3,
      alpha: 0,
      duration: 450,
      onComplete: () => ring.destroy(),
    });
  }
}
