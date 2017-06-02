import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.tilemap('level', 'assets/maps/level2.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gametiles', 'assets/images/tiles2.png');
    this.load.spritesheet('ms', 'assets/images/metalslug_mummy37x45.png', 37, 45, 18);
  }

  create () {
    this.state.start('Game')
  }
}
