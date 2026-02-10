class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  

  create() {
    const { width, height } = this.scale;

    //estado
    this.phase = 'INGREDIENTS';
    this.mistakes = 0;
    this.score = 0;

    //Estilo de temporizador
    this.timerText = this.add.text(width * 0.05, height * 0.03, '', {
      fontSize: '16px',
      color: '#000'
    });

    this.startTimer(30);

    //Titulo de la receta
this.add.text(width / 2, height * 0.07, '🍚 Arroz con leche', {
  fontSize: '22px',
  color: '#7b5cff',
  fontStyle: 'bold'
}).setOrigin(0.5);

    //Estilo instrucciones
this.instructionText = this.add.text(width / 2, height * 0.13, '', {
  fontSize: '16px',
  color: '#7b5cff',
  align: 'center',
  fontStyle: 'bold',
  wordWrap: { width: width * 0.9 }
}).setOrigin(0.5);


    //Bowl
    this.bowl = this.add.rectangle(
      width / 2,
      height * 0.55,
      width * 0.5,
      height * 0.18,
      0xffe5b4
    ).setStrokeStyle(2, 0x000000);

    //Orden en que los ingredientes se deben agregar
    this.ingredientOrder = ['rice', 'milk', 'lemon', 'cinnamon'];
    this.currentIngredientIndex = 0;

    //Ingredientes
    this.ingredients = {
      rice: this.createIngredient('🍚', width * 0.1, height * 0.35, 'rice'),
      milk: this.createIngredient('🥛', width * 0.1, height * 0.45, 'milk'),
      lemon: this.createIngredient('🍋', width * 0.9, height * 0.35, 'lemon'),
      cinnamon: this.createIngredient('🌰', width * 0.9, height * 0.45, 'cinnamon')
    };

    //Cuchara
    this.spoon = this.add.text(width * 0.15, height * 0.55, '🥄', {
      fontSize: '40px'
    });
    this.spoon.setVisible(false);

    //Arrastrar
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (pointer, gameObject) => {
      if (this.phase !== 'INGREDIENTS') return;

      const expected = this.ingredientOrder[this.currentIngredientIndex];
      const insideBowl = Phaser.Geom.Rectangle.Contains(
        this.bowl.getBounds(),
        gameObject.x,
        gameObject.y
      );

      if (insideBowl && gameObject.name === expected) {
        gameObject.setVisible(false);
        gameObject.disableInteractive();
        this.currentIngredientIndex++;
        this.score += 20;
      } else {
        gameObject.x = gameObject.startX;
        gameObject.y = gameObject.startY;
        this.score -= 5;
        this.mistakes++;
      }

      if (this.currentIngredientIndex === this.ingredientOrder.length) {
        this.startFirePhase();
      }
    });

    //Fuego
    this.fireLevel = 0;
    this.fireBars = [];

    for (let i = 0; i < 3; i++) {
      const bar = this.add.rectangle(
        width / 2 - 30 + i * 30,
        height * 0.68,
        20,
        30,
        0xcccccc
      );
      bar.setVisible(false);
      this.fireBars.push(bar);
    }

    this.fireBtn = this.add.text(width / 2, height * 0.75, '🔥 Subir fuego', {
      fontSize: '16px',
      backgroundColor: '#ffb703',
      color: '#000',
      padding: { x: 24, y: 16 }
    }).setOrigin(0.5).setInteractive();

    this.fireBtn.setVisible(false);

    this.fireBtn.on('pointerdown', () => {
      if (this.phase !== 'FIRE') return;

      if (this.fireLevel < 3) {
        this.fireBars[this.fireLevel].setFillStyle(0xff8c00);
        this.fireLevel++;
      }

      if (this.fireLevel === 3) {
        this.score += 30;
        this.startStirPhase();
      }
    });

    //Barra de progreso al revolver
    this.cookBarBg = this.add.rectangle(
      width / 2,
      height * 0.85,
      width * 0.6,
      20,
      0xcccccc
    );

    this.cookBar = this.add.rectangle(
      width / 2 - (width * 0.6) / 2,
      height * 0.85,
      0,
      20,
      0xffb703
    ).setOrigin(0, 0.5);

    this.updateInstructions();

   //CHATBOT
this.chatOpen = false;

// Botón abrir chatbot
this.chatBtn = this.add.text(20, height - 40, '🤖 Chef ayuda', {
  fontSize: '14px',
  backgroundColor: '#90dbf4',
  color: '#000',
  padding: { x: 10, y: 6 }
}).setInteractive();

// Fondo
this.chatBox = this.add.rectangle(
  width / 2,
  height / 2,
  width * 0.85,
  height * 0.45,
  0xffffff
).setStrokeStyle(2, 0x000000).setVisible(false);

// Texto bot
this.chatText = this.add.text(
  width / 2,
  height / 2 - 80,
  '👩‍🍳 Hola, soy tu chef ayudante.\n¿En qué te ayudo?',
  {
    fontSize: '14px',
    color: '#000',
    align: 'center',
    wordWrap: { width: width * 0.75 }
  }
).setOrigin(0.5).setVisible(false);

// Botón CERRAR ❌
this.chatCloseBtn = this.add.text(
  width / 2 + (width * 0.35),
  height / 2 - (height * 0.18),
  '❌',
  { fontSize: '18px', color: '#000' }
).setInteractive().setVisible(false);

// Botones opciones
const makeBtn = (y, text) =>
  this.add.text(width / 2, y, text, {
    fontSize: '14px',
    backgroundColor: '#ffd166',
    padding: 6
  }).setOrigin(0.5).setInteractive().setVisible(false);

this.btnAyuda = makeBtn(height / 2 - 40, 'Ayuda');
this.btnIngredientes = makeBtn(height / 2, 'Ingredientes');
this.btnFuego = makeBtn(height / 2 + 40, 'Fuego');
this.btnMezclar = makeBtn(height / 2 + 80, 'Mezclar');
this.btnTiempo = makeBtn(height / 2 + 120, 'Tiempo');



// ABRIR CHAT
this.chatBtn.on('pointerdown', () => {
  this.chatOpen = true;
  this.timerPaused = true; // ⏸️ PAUSA TIEMPO

  this.chatBox.setVisible(true);
  this.chatText.setVisible(true);
  this.chatCloseBtn.setVisible(true);
  this.btnAyuda.setVisible(true);
  this.btnIngredientes.setVisible(true);
  this.btnFuego.setVisible(true);
  this.btnMezclar.setVisible(true);
  this.btnTiempo.setVisible(true);
});

// CERRAR CHAT
this.chatCloseBtn.on('pointerdown', () => {
  this.chatOpen = false;
  this.timerPaused = false; // ▶️ REANUDA TIEMPO

  this.chatBox.setVisible(false);
  this.chatText.setVisible(false);
  this.chatCloseBtn.setVisible(false);
  this.btnAyuda.setVisible(false);
  this.btnIngredientes.setVisible(false);
  this.btnFuego.setVisible(false);
  this.btnMezclar.setVisible(false);
  this.btnTiempo.setVisible(false);
});

// RESPUESTAS DEL BOT
this.btnAyuda.on('pointerdown', () => {
  this.chatText.setText(
    '👩‍🍳 Arrastra los ingredientes en el orden correcto y sigue cada fase.'
  );
});

this.btnIngredientes.on('pointerdown', () => {
  this.chatText.setText(
    '👩‍🍳 El orden correcto es: arroz 🍚, leche 🥛, limón 🍋 y canela 🌰.'
  );
});

this.btnFuego.on('pointerdown', () => {
  this.chatText.setText(
    '👩‍🍳 Sube el fuego hasta completar las 3 barras, ni más ni menos.'
  );
});

this.btnMezclar.on('pointerdown', () => {
  this.chatText.setText(
    '👩‍🍳 Coloca la cuchara en el rectangulo y haz movimientos circulares lo más rapido que puedas.'
  );
});

this.btnTiempo.on('pointerdown', () => {
  this.chatText.setText(
    '👩‍🍳 Si el tiempo llega a 0 perderás puntos, ¡apresúrate!'
  );
});

  }

  //Tiempo
startTimer(seconds) {
  if (this.timerEvent) {
    this.timerEvent.remove(false);
  }

  this.timeLeft = seconds;
  this.timerPaused = false;
  this.timerText.setText(`⏱️ ${this.timeLeft}`);

  this.timerEvent = this.time.addEvent({
    delay: 1000,
    callback: () => {
      if (this.timerPaused) return; // ⏸️ PAUSA AQUÍ

      this.timeLeft--;
      this.timerText.setText(`⏱️ ${this.timeLeft}`);

      if (this.timeLeft <= 0) {
        this.timerEvent.remove(false);
        this.score -= 20;
        this.nextPhaseByTime();
      }
    },
    loop: true
  });
}


  nextPhaseByTime() {
    if (this.phase === 'INGREDIENTS') this.startFirePhase();
    else if (this.phase === 'FIRE') this.startStirPhase();
    else this.finishRecipe();
  }

  createIngredient(symbol, x, y, name) {
    const item = this.add.text(x, y, symbol, {
      fontSize: '36px'
    }).setOrigin(0.5).setInteractive({ draggable: true });

    item.name = name;
    item.startX = x;
    item.startY = y;
    this.input.setDraggable(item);
    return item;
  }

  updateInstructions() {
    const text = {
      INGREDIENTS: 'Agrega los ingredientes en este orden 🍚 → 🥛 → 🍋 → 🌰',
      FIRE: 'Sube el nivel del fuego',
      STIR: 'Revuelve el arroz con leche'
    };
    this.instructionText.setText(text[this.phase]);
  }

  startFirePhase() {
    this.phase = 'FIRE';
    this.startTimer(15);
    this.fireBtn.setVisible(true);
    this.fireBars.forEach(b => b.setVisible(true));
    this.updateInstructions();
  }

  startStirPhase() {
    this.phase = 'STIR';
    this.startTimer(10);

    this.fireBtn.setVisible(false);
    this.fireBars.forEach(b => b.setVisible(false));

    this.spoon.setVisible(true);
    this.spoon.setInteractive({ draggable: true });
    this.input.setDraggable(this.spoon);

    this.lastSpoonX = this.spoon.x;
    this.lastSpoonY = this.spoon.y;
    this.stirProgress = 0;

    this.updateInstructions();
  }

  update() {
    if (this.phase !== 'STIR') return;

    const insideBowl = Phaser.Geom.Rectangle.Contains(
      this.bowl.getBounds(),
      this.spoon.x,
      this.spoon.y
    );

    if (!insideBowl) return;

    const dx = this.spoon.x - this.lastSpoonX;
    const dy = this.spoon.y - this.lastSpoonY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 2) {
      this.stirProgress += distance;
      this.cookBar.width = Math.min(
        this.stirProgress,
        this.cookBarBg.width
      );
    }

    this.lastSpoonX = this.spoon.x;
    this.lastSpoonY = this.spoon.y;

    if (this.stirProgress >= this.cookBarBg.width) {
      this.score += 90;
      this.finishRecipe();
    }
  }

  finishRecipe() {
    this.scene.start('Result', {
      score: this.score,
      mistakes: this.mistakes
    });
  }
}
