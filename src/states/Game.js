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
    Phaser.Canvas.setSmoothingEnabled(this.game.canvas, false);
  }

  create () {
    this.bigPixels(6);
    this.max_terrain = 10;
    this.river_speed = 10;
    this.speed = this.river_speed;
    this.distance = 0.0;

    // start looping the background music
    this.music = this.game.add.audio("music");
    this.music.loopFull();

    // create the background sky
    var moon = this.game.add.sprite(42, 4, 'sprites');
    moon.frameName = 'moon';

    // create the raft that the player controls
    this.raft = new Player(this.game, 32, 64 - 6)
    this.sprite3d(this.raft, 32.0, 0.0, 9.0);

    // create the cannonball that shoots from the raft
    this.cannonBall = this.game.add.sprite(42, 4, 'sprites');
    this.cannonBall.frameName = 'cannonball';
    this.cannonBall.visible = false;
    this.cannonBall.timer = 0;
    this.sprite3d(this.cannonBall, 32, 0, 9.0);

    // place men on the raft
    this.men = [
      new Man(this.game, -5, -5),
      new Man(this.game,  5, -5),
      new Man(this.game, -2, -3),
      new Man(this.game,  2, -1),
    ];
    for (var i=0; i<this.men.length; i++)
      this.raft.addChild(this.men[i]);
    // have one of the men turn every second
    setInterval(function(ctx) {
      var man = Math.floor((Math.random()*ctx.men.length));
      ctx.men[man].scale.x = -ctx.men[man].scale.x;
    }, 1000, this);

    // create the bounds of the river
    var N = 10;
    this.centerline = [];
    for (var i=0; i<N; i++)
      this.centerline.push({x: 0.0, z: i*10.0 + 1.0});
    this.pts = [];
    for (var i=0; i<N; i++) {
      var pt = new Phaser.Point(0, 0);
      this.sprite3d(pt, 16.0, 0.0, i*10.0 + 1.0);
      this.pts.push(pt);
    }
    for (var i=N-1; i>=0; i--) {
      var pt = new Phaser.Point(0, 0);
      this.sprite3d(pt, 48.0, 0.0, i*10.0 + 1.0);
      this.pts.push(pt);
    }
    this.riverBounds = new Phaser.Polygon(this.pts);
    this.graphics = game.add.graphics(0, 0);

    // create the bounds of the land
    var pts = [
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
    this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
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
    this.graphics.drawPolygon(this.pts);
    this.graphics.endFill();
  }

  sprite3d(sprite, x, y, z) {
    sprite.global = {x: x, y: y, z: z};
    sprite.camera = {};
    sprite.screen = {};
  }

  update() {
    var dt = this.game.time.physicsElapsed;
    this.distance += dt * this.speed;

    if (this.cursor.left.isDown) {
      this.raft.global.x-=dt*10;
    }
    else if (this.cursor.right.isDown) {
      this.raft.global.x+=dt*10;
    }
    else if (this.spacebar.isDown) {
      this.shoot();
    }

    // update points on the river
    this.update_centerline();
    for (var i=0; i<this.pts.length / 2; i++) {
      var pt = this.pts[i];
      pt.global.x = this.centerline[i].x + 16;
      pt.global.z = this.centerline[i].z;
      this.project(pt, 10, false);
    }
    for (var i=this.pts.length/2; i<this.pts.length; i++) {
      var pt = this.pts[i];
      pt.global.x = this.centerline[this.pts.length - i - 1].x + 48;
      pt.global.z = this.centerline[this.pts.length - i - 1].z;
      this.project(pt, 10, false);
    }
    
    // update the landscape sprites
    for (var i=0; i<this.terrain.length; i++) {
      var t = this.terrain.getAt(i);
      t.global.z -= dt * this.speed;
      this.project(t, 0.6, true);
      if (t.global.z < 0.0) {
        this.terrain.removeChildAt(i);
        t.destroy();
        this.terrain.add(this.spawn_terrain(), false, 0);
      }
    }

    // check if we hit anything
    var raftX = this.raft.global.x;
    var raftZ = this.raft.global.z;
    this.speed = this.river_speed;
    for (var i=0; i<this.terrain.length; i++) {
      var t = this.terrain.getAt(i);
      if (Math.abs(raftZ - t.global.z) < 5.0) {
        if (Math.abs(raftX - t.global.x) < 5.0) {
          if (t.enemy) {
            console.log("hit!");
            if (this.men.length > 1) {
              var man = this.men.pop();
              t.addChild(man);
              t.enemy = false;
            } else
              this.state.start("GameOver");
          } else if (t.immovable) {
            this.speed = 0.0;
          } else if (t.slowdown) {
            this.speed = this.river_speed / 2.0;
          }
        }
      }
    }
    

    // move the raft along the river if it is out of bounds
    var cx = this.centerline[1].x;
    if (raftX-32 < cx - 12)
      this.raft.global.x = cx - 12 + 32;
    if (raftX-32 > cx + 12)
      this.raft.global.x = cx + 12 + 32;

    // project raft's on the scene
    this.project(this.raft, 1.0, false);

    // cannonball update
    if (this.cannonBall.timer >= 0.0) {
      var cb = this.cannonBall;
      cb.global.z += dt * 100.0;
      cb.timer -= dt;
      this.project(cb, 1, true);
    } else {
      this.cannonBall.visible = false;
    }
  }

  centerlineAt(z) {
    return noise.simplex2((z + this.distance) / 100.0, 0.0) * 20
  }

  update_centerline() {
    for (var i=0; i<this.centerline.length; i++) {
      var pt = this.centerline[i];
      this.centerline[i].x = this.centerlineAt(pt.z);
    }
  }

  spawn_terrain() {
    // calculate where to spawn
    var z = Math.random()*50 + 50;
    var cl = this.centerlineAt(z);
    var x = Math.random() * 128 - 64;
    var left = false;
    if (x > 0) {
      x += 16 + cl;
    }
    else if (x < 0) {
      x -= 16 + cl;
      left = true;
    }
    x += 32;

    // figure out what to spawn
    var t = Math.random();
    var s = null;
    if (t < 0.5) {
      s = this.game.add.sprite(0, 0, 'sprites');
      s.anchor.setTo(0.5, 1.0);
      s.frameName = 'tree';
      s.immovable = true;
    } else {
      s = new Native(this.game, 0, 0)
      s.enemy = true;
      if (left)
        s.runTo(32 + cl - 14);
      else
        s.runTo(32 + cl + 14);
    }

    this.sprite3d(s, x, 0, z);
    return s;
  }

  project(p, spriteWidth, scale) {
    var width = config.gameWidth;
    var height = config.gameHeight;
    p.camera.x     = (p.global.x || 0) - config.camera.x;
    p.camera.y     = (p.global.y || 0) - config.camera.y;
    p.camera.z     = (p.global.z || 0) - config.camera.z;
    p.screen.scale = config.camera.depth/p.camera.z;
    p.screen.x     = Math.round((width/2)  + (p.screen.scale * p.camera.x  * width/2));
    p.screen.y     = Math.round((height/8) - (p.screen.scale * p.camera.y  * height/8));
    p.screen.w     = (p.screen.scale * spriteWidth   * width/2);
    p.x = p.screen.x;
    p.y = p.screen.y;
    if (scale) {
      p.scale.x = p.screen.w;
      p.scale.y = p.screen.w;
    }
  }

  shoot() {
    if (this.cannonBall.timer <= 0.0) {
      this.cannonBall.timer = 1.0;
      this.cannonBall.visible = true;
      this.cannonBall.global.x = this.raft.global.x;
      this.cannonBall.global.y = this.raft.global.y;
      this.cannonBall.global.z = this.raft.global.z + 10.0;
      this.game.world.bringToTop(this.cannonBall);
    }
  }
}
