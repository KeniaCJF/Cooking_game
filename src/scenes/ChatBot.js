class ChatBotIA extends Phaser.Scene {
  constructor() {
    super('ChatBotIA');
  }

  create() {
    const { width, height } = this.scale;

    // Fondo suave
    this.add.rectangle(0, 0, width, height, 0xf5f3ff)
      .setOrigin(0);

    // Botón volver
    const backBtn = this.add.text(width / 2, 40, '⬅ Volver', {
      fontSize: '18px',
      backgroundColor: '#ffffff',
      color: '#9b87ff',
      padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    backBtn.on('pointerdown', () => {
      const existing = document.getElementById('zapier-chatbot');
      if (existing) existing.remove();
      this.scene.start('Menu');
    });

    // Contenedor más delgado
    const container = document.createElement('div');
    container.id = 'zapier-chatbot';

    container.style.position = 'absolute';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';

    container.style.width = '350px';   // 👈 más delgado
    container.style.height = '500px';  // 👈 menos alto
    container.style.maxWidth = '90vw';

    container.style.borderRadius = '20px';
    container.style.overflow = 'hidden';
    container.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
    container.style.zIndex = '10';

    container.innerHTML = `
      <zapier-interfaces-chatbot-embed
        is-popup="false"
        chatbot-id="cmlzvwb92005h11rvq7j18oa1"
        style="width:100%; height:100%;">
      </zapier-interfaces-chatbot-embed>
    `;

    document.body.appendChild(container);
  }
}