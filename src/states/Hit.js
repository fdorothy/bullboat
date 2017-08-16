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

  create () {
    // create the raft that the player controls
    var raft_x = 32;
    var raft_y = 32;
    this.raft = this.game.add.sprite(raft_x, raft_y, 'sprites');
    this.raft.frameName = 'raft';
    this.raft.anchor.setTo(0.5, 1.0);

    // place men on the raft
    var pos = [[-5, -5],
               [5, -5],
               [-2, -3],
               [2, -1]];
    this.man = null;
    for (var i=0; i<config.player.lives; i++) {
      var [x,y] = pos[i];
      this.man = this.game.add.sprite(x + raft_x, y + raft_y, "sprites");
      this.man.anchor.setTo(0.5, 1.0);
      this.man.frameName = 'frontiersman';
    }

    // place native and tween him across the screen
    this.enemy = this.game.add.sprite(48, this.man.y, "sprites");
    this.enemy.anchor.setTo(0.5, 1.0);
    this.enemy.frameName = 'native_3';
    this.timer = 5.0;
    this.tween = null;
  }

  render () {
  }

  update() {
    var dt = this.game.time.physicsElapsed;
    this.timer -= dt;

    if (this.timer < 4.0 && this.tween == null) {
      this.tween = this.game.add.tween(this.enemy).to({x: this.man.x + 5});
      this.tween.start();
      this.tween.onComplete.add(this.goBack, this);
    }

    if (this.timer <= 0.0) {
      config.player.lives -= 1;
      if (config.player.lives <= 0)
        this.state.start("GameOver");
      else
        this.state.start("Game");
    }
  }

  goBack() {
    console.log("go back");
    this.man.x = 0;
    this.man.y = 0;
    this.enemy.addChild(this.man);
    var tween = this.game.add.tween(this.enemy).to({x: 100}, 2000)
    tween.start();
  }
}
