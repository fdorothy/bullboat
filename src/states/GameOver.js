/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    const bannerText = 'GAME OVER'
    let banner = this.add.text(this.world.centerX, this.game.height / 2.0, bannerText)
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)

    var retry = game.make.sprite(this.world.centerX, this.game.height / 2.0, 'retry');
    retry.inputEnabled = true;
    retry.input.priorityID = 1;
    retry.input.useHandCursor = true;
    retry.events.onInputDown.add(this.onretry, this);
  }

  onretry () {
    this.state.start('Game');
  }

render () {
  }
}
