import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor (game, x, y) {
    super(game, x, y, "sprites")
    game.physics.arcade.enable(this);
    this.anchor.setTo(0.5, 1.0);
    this.frameName = 'frontiersman';
    this.x;
    this.y;
  }
}
