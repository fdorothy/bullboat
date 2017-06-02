/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'

import config from '../config'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#000'
  }
  preload () {}

  create () {
    this.player = new Player({
      game: this.game,
      x: config.initial.start.x,
      y: config.initial.start.y,
      asset: 'ms'
    })

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.map = game.add.tilemap('level');
    this.map.addTilesetImage('tiles', 'gametiles');

    this.doors = this.map.createLayer('doors');
    this.bg = this.map.createLayer('background');
    this.bounds = this.map.createLayer('bounds');

    this.game.add.existing(this.player)

    this.water = this.map.createLayer('water');
    this.bg = this.map.createLayer('foreground');

    this.bounds.resizeWorld();
    this.map.setCollisionBetween(1, 2000, true, 'bounds');

    this.water.alpha = 0.6;

    this.cursor = this.game.input.keyboard.createCursorKeys();
    this.game.input.keyboard.addKeyCapture([
    	Phaser.Keyboard.LEFT,
    	Phaser.Keyboard.RIGHT,
    	Phaser.Keyboard.UP,
    	Phaser.Keyboard.DOWN,
    	Phaser.Keyboard.SPACEBAR
    ]);

    // shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);
    // lightSprite = this.game.add.image(this.game.camera.x, this.game.camera.y, shadowTexture);
    // lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
  }

  render () {
  }

  update() {
    game.physics.arcade.collide(this.player, this.bounds);
    var blocked = this.player.body.blocked.down;
    if (this.cursor.left.isDown) {
      this.player.moveLeft();
    }
    else if (this.cursor.right.isDown) {
      this.player.moveRight();
    }
    else if (blocked) {
      this.player.stop();
    }
    if (this.cursor.up.isDown) {
      this.player.jump();
    }
    //lightSprite.reset(game.camera.x, game.camera.y);
    //updateShadowTexture();
  }
}
