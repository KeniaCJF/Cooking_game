class Result extends Phaser.Scene {
  constructor() {
    super('Result');
  }

  init(data) {
    this.score = data.score;
  }


  create() {
    let stars = 3;

    if (this.score <= 0) stars = 0;
    else if (this.score <= 80) stars = 1;
    else if (this.score <= 150) stars = 2;
    else stars = 3;

    //Texto
    this.add.text(180, 140, '¡Receta terminada!', {
      fontSize: '22px',
      color: '#7b5cff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(180, 190, 'Puntaje: ' + this.score, {
      fontSize: '18px',
      color: '#7b5cff'
    }).setOrigin(0.5);

    this.add.text(180, 230, '⭐'.repeat(stars), {
      fontSize: '32px',
      color: '#ffb703'
    }).setOrigin(0.5);

    //boton para regresar
    const back = this.add.text(180, 420, 'Volver al menú', {
      fontSize: '18px',
      backgroundColor: '#ffffff',
      color: '#7b5cff',
      fontStyle: 'bold',
      padding: { x: 24, y: 12 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    back.on('pointerdown', () => {
      this.scene.start('Menu');
    });
  }
}
