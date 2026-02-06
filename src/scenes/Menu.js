class Menu extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    this.add.text(180, 150, 'Cooking Game', {
      fontSize: '28px',
      color: '#7b5cff'
    }).setOrigin(0.5);

    this.createButton(180, 260, 'Play', () => {
      this.scene.start('Levels');
    });

    this.createButton(180, 330, 'Select level', () => {
      this.scene.start('Levels');
    });
  }

  createButton(x, y, text, callback) {
    const width = 180;
    const height = 50;
    const radius = 25;

    // Sombra
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.15);
    shadow.fillRoundedRect(
      x - width / 2 + 4,
      y - height / 2 + 4,
      width,
      height,
      radius
    );

    // Fondo
    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 1);
    bg.fillRoundedRect(
      x - width / 2,
      y - height / 2,
      width,
      height,
      radius
    );

    // Texto
    const label = this.add.text(x, y, text, {
      fontSize: '18px',
      color: '#7b5cff'
    }).setOrigin(0.5);

    // Zona interactiva
    const zone = this.add.zone(x, y, width, height)
      .setInteractive({ useHandCursor: true });

    zone.on('pointerdown', callback);

    // Hover
    zone.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0xf0edff, 1);
      bg.fillRoundedRect(
        x - width / 2,
        y - height / 2,
        width,
        height,
        radius
      );
    });

    zone.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0xffffff, 1);
      bg.fillRoundedRect(
        x - width / 2,
        y - height / 2,
        width,
        height,
        radius
      );
    });
  }
}
