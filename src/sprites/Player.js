import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor (game, x, y) {
    super(game, x, y, "sprites")
    this.anchor.setTo(0.5, 1.0);
    this.frameName = 'raft';
    this.scale.x = 1.0;
    this.scale.y = 1.0;
  }
}
