class Menu extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    this.add.text(180, 200, '🍳 Juego de Cocina', {
      fontSize: '28px',
      color: '#5c4033'
    }).setOrigin(0.5);

    const start = this.add.text(180, 320, 'Iniciar', {
      fontSize: '22px',
      backgroundColor: '#ffb703',
      color: '#000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    start.on('pointerdown', () => {
      this.scene.start('Levels');
    });
  }
}
