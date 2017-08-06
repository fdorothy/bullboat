import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y}) {
    super(game, x, y, "sprites")
    game.physics.arcade.enable(this);
    this.anchor.setTo(0.5, 1.0);
    this.frameName = 'native_2';
  }

  update() {
    var vx = 0.0;
    var dt = this.game.time.physicsElapsed;
    if (this.global.x < 16.0)
      vx = 25.0;
    else if (this.global.x > 48.0)
      vx = -25.0;
    else
      vx = 0.0;
    this.global.x = vx * dt + this.global.x;
  }
}
