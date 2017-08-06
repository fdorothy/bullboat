import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y}) {
    super(game, x, y, "sprites")
    game.physics.arcade.enable(this);
    this.anchor.setTo(0.5, 1.0);
    this.frameName = 'raft';
    this.scale.x = 1.0;
    this.scale.y = 1.0;
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
    this.body.velocity.x = vx;
  }
}
