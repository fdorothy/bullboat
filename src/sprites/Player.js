import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    game.physics.arcade.enable(this);
    this.anchor.setTo(0.5, 1.0);
  }

  update () {
  }

  moveLeft() {
    var dt = this.game.time.physicsElapsed;
    var accel = config.player.accel;
    var vx = this.body.velocity.x - accel * dt;
    if (vx < -config.player.targetSpeed) {
      vx = -config.player.targetSpeed;
    } else if (vx > -config.player.initialSpeed) {
      vx = -config.player.initialSpeed;
    }
    this.body.velocity.x = vx;
    this.scale.x = -1;
    this.paddleAnimation();
  }

  moveRight() {
    var dt = this.game.time.physicsElapsed;
    var accel = config.player.accel;
    var vx = this.body.velocity.x + accel * dt;
    if (vx > config.player.targetSpeed) {
      vx = config.player.targetSpeed;
    } else if (vx < config.player.initialSpeed) {
      vx = config.player.initialSpeed;
    }
    this.body.velocity.x = vx;
    this.scale.x = 1;
    this.paddleAnimation();
  }

  stop() {
    var dt = this.game.time.physicsElapsed;
    var vx = this.body.velocity.x;
    if (vx < 0) {
      vx += config.player.deaccel * dt;
      if (vx > 0)
	vx = 0;
    } else if (vx > 0) {
      vx -= config.player.deaccel * dt;
      if (vx < 0)
	vx = 0;
    }
    if (vx < config.player.initialSpeed && vx > -config.player.initialSpeed)
      vx = 0;
    this.stopAnimation();
    this.body.velocity.x = vx;
  }

  paddleAnimation() {
  }

  stopAnimation() {
  }
}
