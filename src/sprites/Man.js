import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y}) {
    super(game, x, y, "sprites")
    game.physics.arcade.enable(this);
    this.anchor.setTo(0.5, 1.0);

    this.animations.add('standing', ['frontiersman'], 5, true);
    this.animations.play('standing');

    this.rel_x = x;
    this.rel_y = y;
  }

  moveLeft() {
    this.scale.x = 1;
  }

  moveRight() {
    this.scale.x = -1;
  }

  stop() {
  }
}
