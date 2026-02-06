const config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  backgroundColor: '#fffaf0',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  input: {
    activePointers: 3 // permite multitouch
  },
  scene: [Menu, Levels, Game, Result]
};

new Phaser.Game(config);
