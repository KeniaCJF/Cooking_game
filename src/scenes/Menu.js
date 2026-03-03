class Menu extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const { width, height } = this.scale;

    // TÍTULO
    this.add.text(width / 2, height * 0.25, 'Cooking Game', {
      fontSize: '32px',
      color: '#9b87ff'
    }).setOrigin(0.5);

    // BOTÓN PLAY
    this.createButton(
      width / 2,
      height * 0.45,
      'Play',
      () => {
        this.scene.start('Game');
      }
    );

    // BOTÓN SELECT LEVEL
    this.createButton(
      width / 2,
      height * 0.55,
      'Select level',
      () => {
        this.scene.start('Levels');
      }
    );

    // 🤖 BOTÓN CHATBOT IA
    this.createButton(
      width / 2,
      height * 0.65,
      'Chat con IA 🤖',
      () => {
        this.scene.start('ChatBotIA');
      }
    );

  const payBtn = this.add.text(
  width / 2,
  height * 0.65,
  '💳 Comprar versión premium',
  {
    fontSize: '16px',
    backgroundColor: '#ffd166',
    padding: { x: 20, y: 12 }
  }
).setOrigin(0.5).setInteractive();

payBtn.on('pointerdown', () => {
  window.location.href = "./public/payment.html";
});

  }

  createButton(x, y, text, callback) {
    const btn = this.add.text(x, y, text, {
      fontSize: '18px',
      backgroundColor: '#ffffff',
      color: '#9b87ff',
      padding: { x: 40, y: 16 }
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    btn.on('pointerdown', callback);
    return btn;
  }
}