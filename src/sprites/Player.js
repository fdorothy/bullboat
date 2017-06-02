import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    game.physics.arcade.enable(this);
    this.anchor.setTo(0.5)
    this.jumps = config.player.jumps;
    this.body.collideWorldBounds = true;
    this.body.gravity.y = config.world.gravity;
    this.animations.add('walk', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], 60, true);
    this.anchor.setTo(0.5, 0.5);
  }

  update () {
    if (this.body.blocked.down) {
      this.jumps = config.player.jumps;
    } else {
      this.jumpAnimation();
    }
  }

  moveLeft() {
    var dt = this.game.time.physicsElapsed;
    var accel = config.player.groundAccel;
    if (!this.body.blocked.down)
      accel = config.player.airAccel;
    var vx = this.body.velocity.x - accel * dt;
    if (vx < -config.player.targetSpeed) {
      vx = -config.player.targetSpeed;
    } else if (vx > -config.player.initialSpeed) {
      vx = -config.player.initialSpeed;
    }
    this.body.velocity.x = vx;
    this.scale.x = -1;
    this.walkAnimation();
  }

  moveRight() {
    var dt = this.game.time.physicsElapsed;
    var accel = config.player.groundAccel;
    if (!this.body.blocked.down)
      accel = config.player.airAccel;
    var vx = this.body.velocity.x + accel * dt;
    if (vx > config.player.targetSpeed) {
      vx = config.player.targetSpeed;
    } else if (vx < config.player.initialSpeed) {
      vx = config.player.initialSpeed;
    }
    this.body.velocity.x = vx;
    this.scale.x = 1;
    this.walkAnimation();
  }

  jump() {
    if (this.jumps > 0) {
      this.body.velocity.y = -config.player.targetJumpSpeed;
      this.jumps -= 1;
    }
  }

  stop() {
    var dt = this.game.time.physicsElapsed;
    var vx = this.body.velocity.x;
    if (vx < 0) {
      vx += config.player.groundDeaccel * dt;
      if (vx > 0)
	vx = 0;
    } else if (vx > 0) {
      vx -= config.player.groundDeaccel * dt;
      if (vx < 0)
	vx = 0;
    }
    if (vx < config.player.initialSpeed && vx > -config.player.initialSpeed) {
      vx = 0;
      this.stopAnimation();
    } else {
      this.stoppingAnimation();
    }
    this.body.velocity.x = vx;
  }

  walkAnimation() {
    this.animations.play('walk');
  }

  stopAnimation() {
    this.animations.stop();
    this.frame = 4;
  }

  stoppingAnimation() {
    this.animations.stop();
    this.frame = 4;
  }

  jumpAnimation() {
    this.animations.stop();
    this.frame = 0;
  }
}
