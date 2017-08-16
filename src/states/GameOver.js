/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#000000';
  }
  preload () {}

  create () {
    const bannerText = 'Game Over'
    let banner = this.add.text(0, 16, "Game Over");
    banner.font = 'Arial'
    banner.padding.set(10, 16)
    banner.fontSize = 12
    banner.fill = '#aaaaaa'
    banner.smoothed = false
    this.timer = 5.0;
  }

  update () {
    var dt = this.game.time.physicsElapsed;
    this.timer -= dt;
    if (this.timer < 0.0)
      this.state.start('Game');
  }

  render () {
  }
}
