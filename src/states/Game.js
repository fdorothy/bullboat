/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'

import config from '../config'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#000'
  }
  preload () {}

  bigPixels(size) {
    game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    game.scale.setUserScale(size, size);

    // enable crisp rendering
    game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
  }

  create () {
    this.bigPixels(4);

    this.player = new Player({
      game: this.game,
      x: 32,
      y: 64 - 6,
      asset: 'ms'
    })

    var pts = [];
    var N = 10;
    for (var i=0; i<N; i++) {
      var p = {world: {x: 16.0, y: 0.0, z: i*10.0 + 1.0}, camera: {}, screen: {}};
      this.project(p, 10);
      console.log(p.screen);
      pts.push(new Phaser.Point(p.screen.x, p.screen.y));
    }
    for (var i=N-1; i>=0; i--) {
      var p = {world: {x: 48.0, y: 0.0, z: i*10.0 + 1.0}, camera: {}, screen: {}};
      this.project(p, 10);
      console.log(p.screen);
      pts.push(new Phaser.Point(p.screen.x, p.screen.y));
    }

    this.riverBounds = new Phaser.Polygon(pts);
    this.graphics = game.add.graphics(0, 0);
    this.graphics.beginFill(0x00aaff);
    this.graphics.drawPolygon(this.riverBounds.points);
    this.graphics.endFill();

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.add.existing(this.player)

    this.cursor = this.game.input.keyboard.createCursorKeys();
    this.game.input.keyboard.addKeyCapture([
    	Phaser.Keyboard.LEFT,
    	Phaser.Keyboard.RIGHT,
    	Phaser.Keyboard.UP,
    	Phaser.Keyboard.DOWN,
    	Phaser.Keyboard.SPACEBAR
    ]);
  }

  render () {
  }

  update() {
    this.graphics.clear();
    this.graphics.beginFill(0xFF33ff);
    this.graphics.drawPolygon(this.riverBounds.points);
    this.graphics.endFill();

    if (this.cursor.left.isDown) {
      this.player.moveLeft();
    }
    else if (this.cursor.right.isDown) {
      this.player.moveRight();
    } else {
      this.player.stop();
    }
  }

  project(p, roadWidth) {
    var width = config.gameWidth;
    var height = config.gameHeight;
    p.camera.x     = (p.world.x || 0) - config.camera.x;
    p.camera.y     = (p.world.y || 0) - config.camera.y;
    p.camera.z     = (p.world.z || 0) - config.camera.z;
    p.screen.scale = config.camera.depth/p.camera.z;
    p.screen.x     = Math.round((width/2)  + (p.screen.scale * p.camera.x  * width/2));
    p.screen.y     = Math.round((height/8) - (p.screen.scale * p.camera.y  * height/8));
    p.screen.w     = Math.round(             (p.screen.scale * roadWidth   * width/2));
  }
}
