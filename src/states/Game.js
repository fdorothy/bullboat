/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import Man from '../sprites/Man'
import Native from '../sprites/Native'

import config from '../config'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#66c3ff';
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
    this.max_terrain = 10;
    this.speed = 10;

    // create the raft that the player controls
    this.raft = new Player({
      game: this.game,
      x: 32,
      y: 64 - 6
    })

    // place men on the raft
    this.men = [
      new Man({game: this.game, x: -5, y: -5}),
      new Man({game: this.game, x: 5, y: -5}),
      new Man({game: this.game, x: -2, y: -3}),
      new Man({game: this.game, x: 2, y: -1}),
    ];
    for (var i=0; i<this.men.length; i++)
      this.raft.addChild(this.men[i]);
    // have one of the men turn every second
    setInterval(function(ctx) {
      var man = Math.floor((Math.random()*ctx.men.length));
      ctx.men[man].scale.x = -ctx.men[man].scale.x;
    }, 1000, this);

    // create the bounds of the river
    var pts = [];
    var N = 10;
    for (var i=0; i<N; i++) {
      var p = {global: {x: 16.0, y: 0.0, z: i*10.0 + 1.0}, camera: {}, screen: {}};
      this.project(p, 10);
      console.log(p.screen);
      pts.push(new Phaser.Point(p.screen.x, p.screen.y));
    }
    for (var i=N-1; i>=0; i--) {
      var p = {global: {x: 48.0, y: 0.0, z: i*10.0 + 1.0}, camera: {}, screen: {}};
      this.project(p, 10);
      console.log(p.screen);
      pts.push(new Phaser.Point(p.screen.x, p.screen.y));
    }
    this.riverBounds = new Phaser.Polygon(pts);
    this.graphics = game.add.graphics(0, 0);

    // create the bounds of the land
    pts = [
      new Phaser.Point(0, 12),
      new Phaser.Point(64, 12),
      new Phaser.Point(64, 64),
      new Phaser.Point(0, 64)
    ];
    this.landBounds = new Phaser.Polygon(pts);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // cannister for landscape sprites
    this.terrain = this.game.add.group();
    for (var i=0; i<this.max_terrain; i++)
      this.terrain.add(this.spawn_terrain(), true, 0);

    // add sprites to the game
    this.game.add.existing(this.raft)

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
    this.graphics.clear();

    // draw the land
    this.graphics.beginFill(0x248a66);
    this.graphics.drawPolygon(this.landBounds.points);
    this.graphics.endFill();

    // draw the water
    this.graphics.beginFill(0x0088e9);
    this.graphics.drawPolygon(this.riverBounds.points);
    this.graphics.endFill();
  }

  update() {
    var dt = this.game.time.physicsElapsed;

    if (this.cursor.left.isDown) {
      this.raft.moveLeft();
    }
    else if (this.cursor.right.isDown) {
      this.raft.moveRight();
    } else {
      this.raft.stop();
    }

    // update the landscape sprites
    for (var i=0; i<this.terrain.length; i++) {
      var t = this.terrain.getAt(i);
      t.global.z -= dt * this.speed;
      this.project(t, 1.0);
      t.x = t.screen.x;
      t.y = t.screen.y;
      t.scale.x = t.screen.w;
      t.scale.y = t.screen.w;
      if (t.global.z < 0.0) {
        this.terrain.removeChildAt(i);
        t.destroy();
        this.terrain.add(this.spawn_terrain(), false, 0);
      }
    }
  }

  spawn_terrain() {
    var t = Math.random();
    var s = null;
    if (t < 0.5) {
      s = this.game.add.sprite(0, 0, 'sprites');
      s.anchor.setTo(0.5, 1.0);
      s.frameName = 'tree';
    } else {
      s = new Native({game: this.game, x: 0, z: 0})
    }

    // place the new terrain randomly in the background
    var x = Math.random() * 128 - 64;
    if (x > 0) x += 16;
    else if (x < 0) x -= 16;
    s.global = {x: x + 32, y: 0, z: Math.random()*50 + 50};
    if (s.global.x > 16) {
      s.global.x += 32;
    }
    s.screen = {};
    s.camera = {};
    return s;
  }

  project(p, spriteWidth) {
    var width = config.gameWidth;
    var height = config.gameHeight;
    p.camera.x     = (p.global.x || 0) - config.camera.x;
    p.camera.y     = (p.global.y || 0) - config.camera.y;
    p.camera.z     = (p.global.z || 0) - config.camera.z;
    p.screen.scale = config.camera.depth/p.camera.z;
    p.screen.x     = Math.round((width/2)  + (p.screen.scale * p.camera.x  * width/2));
    p.screen.y     = Math.round((height/8) - (p.screen.scale * p.camera.y  * height/8));
    p.screen.w     = (             (p.screen.scale * spriteWidth   * width/2));
  }
}
