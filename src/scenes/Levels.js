class Levels extends Phaser.Scene {
  constructor() {
    super('Levels');
  }

  create() {
    this.add.text(180, 150, 'Selecciona un nivel', {
      fontSize: '22px',
      color: '#5c4033'
    }).setOrigin(0.5);

    const level1 = this.add.text(180, 300, 'Nivel 1 🍪', {
      fontSize: '20px',
      backgroundColor: '#8ecae6',
      color: '#000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    level1.on('pointerdown', () => {
      this.scene.start('Game');
    });
  }
}
