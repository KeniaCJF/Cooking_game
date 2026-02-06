class Result extends Phaser.Scene {
  constructor() {
    super('Result');
  }

  init(data) {
    this.score = data.score;
  }

  create() {
  let stars = 3;

  if (this.score <= 0) {
    stars = 0;
  } else if (this.score <= 80) {
    stars = 1;
  } else if (this.score <= 150) {
    stars = 2;
  } else {
    stars = 3;
  }

  this.add.text(180, 180, '¡Receta terminada! 🎉', {
    fontSize: '22px',
    color: '#5c4033'
  }).setOrigin(0.5);

  this.add.text(180, 240, 'Puntaje: ' + this.score, {
    fontSize: '18px',
    color: '#000'
  }).setOrigin(0.5);

  this.add.text(180, 290, '⭐'.repeat(stars), {
    fontSize: '32px',
    color: '#ffb703'
  }).setOrigin(0.5);

  const back = this.add.text(180, 360, 'Volver al menú', {
    fontSize: '18px',
    backgroundColor: '#8ecae6',
    color: '#000',
    padding: { x: 20, y: 10 }
  }).setOrigin(0.5).setInteractive();

  back.on('pointerdown', () => {
    this.scene.start('Menu');
  });
}

}
