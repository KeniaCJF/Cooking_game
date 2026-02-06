class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    const { width, height } = this.scale;

    // ===== ESTADO =====
    this.phase = 'INGREDIENTS';
    this.mistakes = 0;
    this.score = 0;

    // ===== TIMER TEXT =====
    this.timerText = this.add.text(width * 0.05, height * 0.03, '', {
      fontSize: '16px',
      color: '#000'
    });

    this.startTimer(30);

    // ===== TÍTULO =====
    this.add.text(width / 2, height * 0.07, '🍚 Arroz con leche', {
      fontSize: '20px',
      color: '#5c4033'
    }).setOrigin(0.5);

    // ===== INSTRUCCIONES =====
    this.instructionText = this.add.text(width / 2, height * 0.13, '', {
      fontSize: '16px',
      color: '#000',
      align: 'center',
      wordWrap: { width: width * 0.9 }
    }).setOrigin(0.5);

    // ===== BOWL =====
    this.bowl = this.add.rectangle(
      width / 2,
      height * 0.55,
      width * 0.5,
      height * 0.18,
      0xffe5b4
    ).setStrokeStyle(2, 0x000000);

    // ===== ORDEN INGREDIENTES =====
    this.ingredientOrder = ['rice', 'milk', 'lemon', 'cinnamon'];
    this.currentIngredientIndex = 0;

    // ===== INGREDIENTES =====
    this.ingredients = {
      rice: this.createIngredient('🍚', width * 0.1, height * 0.35, 'rice'),
      milk: this.createIngredient('🥛', width * 0.1, height * 0.45, 'milk'),
      lemon: this.createIngredient('🍋', width * 0.9, height * 0.35, 'lemon'),
      cinnamon: this.createIngredient('🌰', width * 0.9, height * 0.45, 'cinnamon')
    };

    // ===== CUCHARA =====
    this.spoon = this.add.text(width * 0.15, height * 0.55, '🥄', {
      fontSize: '40px'
    });
    this.spoon.setVisible(false);

    // ===== DRAG =====
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

    // ===== FUEGO =====
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

    // ===== BARRA REVOLVER =====
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
  }

  // ===== TIMER =====
  startTimer(seconds) {
    if (this.timerEvent) this.timerEvent.remove(false);

    this.timeLeft = seconds;
    this.timerText.setText(`⏱️ ${this.timeLeft}`);

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
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
      INGREDIENTS: 'Agrega los ingredientes EN ORDEN 🍚 → 🥛 → 🍋 → 🌰',
      FIRE: 'Sube el fuego hasta el nivel correcto 🔥',
      STIR: '¡Revuelve rápido! 🥄'
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
