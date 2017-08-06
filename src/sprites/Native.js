import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y}) {
    super(game, x, y, "sprites")
    game.physics.arcade.enable(this);
    this.anchor.setTo(0.5, 1.0);
    this.frameName = 'native_3';
    this.dst = 32;
  }

  runTo(x) {
    this.dst = x;
  }

  update() {
    var vx = 0.0;
    var dt = this.game.time.physicsElapsed;
    if (this.global.x < this.dst)
      vx = 25.0;
    else if (this.global.x > this.dst)
      vx = -25.0;
    else
      vx = 0.0;
    this.global.x = vx * dt + this.global.x;
  }
}
