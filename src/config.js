export default {
  gameWidth: 760,
  gameHeight: 400,
  localStorageName: 'phaseres6webpack',
  world: {
    gravity: 300
  },
  player: {
    initialSpeed: 50,
    targetSpeed: 150,
    targetJumpSpeed: 300,
    jumps: 2,
    airAccel: 100,
    groundAccel: 200,
    groundDeaccel: 2000
  },
  maps: {
    level2: {
      tiles: 'assets/maps/level2.json',
      tilesheet: 'assets/images/tiles2.png'
    }
  },
  initial: {
    map: 'level2',
    start: {
      x: 100,
      y: 60
    }
  }
}
