import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])
    this.load.setPreloadSprite(this.loaderBar)

    this.game.load.atlas("sprites", "assets/images/spritesheet.png", "assets/images/sprites.json")
    this.game.load.audio("music", "assets/sound/water.mp3");
  }

  create () {
    this.state.start('Game')
  }
}
