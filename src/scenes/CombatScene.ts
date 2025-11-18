import Phaser from 'phaser';
import { CombatManager } from '@/core/CombatManager';
import { Character } from '@/entities/Character';
import { Enemy } from '@/entities/Enemy';
import { Card } from '@/entities/Card';
import { createIroncladCharacter, createRandomAct1Encounter } from '@/utils/gameData';

export class CombatScene extends Phaser.Scene {
  private combatManager!: CombatManager;
  private fpsText!: Phaser.GameObjects.Text;

  // UI Elements
  private playerHpText!: Phaser.GameObjects.Text;
  private playerBlockText!: Phaser.GameObjects.Text;
  private playerEnergyText!: Phaser.GameObjects.Text;
  private enemyHpTexts: Phaser.GameObjects.Text[] = [];
  private enemyBlockTexts: Phaser.GameObjects.Text[] = [];
  private enemyIntentTexts: Phaser.GameObjects.Text[] = [];
  private handCards: Phaser.GameObjects.Container[] = [];
  private drawPileText!: Phaser.GameObjects.Text;
  private discardPileText!: Phaser.GameObjects.Text;
  private turnText!: Phaser.GameObjects.Text;

  // Selection
  private selectedCard: Card | null = null;
  private selectedEnemy: Enemy | null = null;

  constructor() {
    super({ key: 'CombatScene' });
  }

  create(): void {
    // Background
    this.cameras.main.setBackgroundColor('#16213e');

    // Initialize combat
    this.initializeCombat();

    // Create UI
    this.createUI();

    // FPS Counter
    this.fpsText = this.add.text(20, 20, 'FPS: 0', {
      fontSize: '16px',
      color: '#00ff00',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    });

    // Back button
    this.createBackButton();

    console.log('✅ Combat scene loaded');
  }

  private initializeCombat(): void {
    // Create player
    const playerData = createIroncladCharacter();
    const player = new Character(playerData);

    // Create enemies
    const enemiesData = createRandomAct1Encounter();
    const enemies = enemiesData.map((data) => new Enemy(data));

    // Initialize combat manager
    this.combatManager = new CombatManager(player, enemies);
    this.combatManager.startCombat();
  }

  private createUI(): void {
    const width = this.cameras.main.width;

    // Title
    const title = this.add.text(width / 2, 30, 'COMBAT', {
      fontSize: '32px',
      color: '#ff6b6b',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    // Turn counter
    this.turnText = this.add.text(width / 2, 70, 'Turn: 1', {
      fontSize: '18px',
      color: '#ffffff',
    });
    this.turnText.setOrigin(0.5);

    // Create player UI (bottom)
    this.createPlayerUI();

    // Create enemy UI (top-middle)
    this.createEnemyUI();

    // Create deck UI (left side)
    this.createDeckUI();

    // Create hand UI (bottom)
    this.createHandUI();

    // Create end turn button
    this.createEndTurnButton();
  }

  private createPlayerUI(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const playerY = height - 250;

    // Player name
    this.add.text(width / 2, playerY, this.combatManager.player.name, {
      fontSize: '24px',
      color: '#4ecdc4',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // HP
    this.playerHpText = this.add.text(width / 2, playerY + 35, '', {
      fontSize: '20px',
      color: '#ff6b6b',
    });
    this.playerHpText.setOrigin(0.5);

    // Block
    this.playerBlockText = this.add.text(width / 2 - 100, playerY + 35, '', {
      fontSize: '18px',
      color: '#95e1d3',
    });
    this.playerBlockText.setOrigin(0.5);

    // Energy
    this.playerEnergyText = this.add.text(width / 2 + 100, playerY + 35, '', {
      fontSize: '20px',
      color: '#f38181',
    });
    this.playerEnergyText.setOrigin(0.5);

    this.updatePlayerUI();
  }

  private createEnemyUI(): void {
    const width = this.cameras.main.width;
    const enemies = this.combatManager.enemies;

    const startX = width / 2 - ((enemies.length - 1) * 200) / 2;
    const enemyY = 200;

    enemies.forEach((enemy, index) => {
      const x = startX + index * 200;

      // Enemy container background
      const bg = this.add.rectangle(x, enemyY, 180, 150, 0x2d4059, 0.8);
      bg.setStrokeStyle(2, 0xea5455);
      bg.setInteractive({ useHandCursor: true });

      // Make enemy selectable
      bg.on('pointerdown', () => {
        this.selectedEnemy = enemy;
        console.log(`Selected enemy: ${enemy.name}`);

        // If we have a selected card, play it
        if (this.selectedCard) {
          this.playSelectedCard();
        }
      });

      bg.on('pointerover', () => {
        bg.setStrokeStyle(3, 0xffffff);
      });

      bg.on('pointerout', () => {
        bg.setStrokeStyle(2, 0xea5455);
      });

      // Enemy name
      this.add.text(x, enemyY - 50, enemy.name, {
        fontSize: '18px',
        color: '#ffffff',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      // HP text
      const hpText = this.add.text(x, enemyY - 10, '', {
        fontSize: '16px',
        color: '#ff6b6b',
      });
      hpText.setOrigin(0.5);
      this.enemyHpTexts.push(hpText);

      // Block text
      const blockText = this.add.text(x, enemyY + 15, '', {
        fontSize: '14px',
        color: '#95e1d3',
      });
      blockText.setOrigin(0.5);
      this.enemyBlockTexts.push(blockText);

      // Intent text
      const intentText = this.add.text(x, enemyY + 40, '', {
        fontSize: '14px',
        color: '#f9ca24',
      });
      intentText.setOrigin(0.5);
      this.enemyIntentTexts.push(intentText);
    });

    this.updateEnemyUI();
  }

  private createDeckUI(): void {
    const x = 50;
    const y = 300;

    // Draw pile
    this.add.text(x, y, 'Draw Pile:', {
      fontSize: '14px',
      color: '#aaaaaa',
    });

    this.drawPileText = this.add.text(x, y + 25, '', {
      fontSize: '16px',
      color: '#ffffff',
    });

    // Discard pile
    this.add.text(x, y + 70, 'Discard:', {
      fontSize: '14px',
      color: '#aaaaaa',
    });

    this.discardPileText = this.add.text(x, y + 95, '', {
      fontSize: '16px',
      color: '#ffffff',
    });

    this.updateDeckUI();
  }

  private createHandUI(): void {
    this.updateHandUI();
  }

  private updateHandUI(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Clear old hand
    this.handCards.forEach((card) => card.destroy());
    this.handCards = [];

    const hand = this.combatManager.player.hand;
    const cardWidth = 120;
    const cardHeight = 160;
    const cardSpacing = 10;
    const totalWidth = hand.length * (cardWidth + cardSpacing) - cardSpacing;
    const startX = width / 2 - totalWidth / 2;
    const cardY = height - cardHeight / 2 - 20;

    hand.forEach((card, index) => {
      const x = startX + index * (cardWidth + cardSpacing) + cardWidth / 2;
      const cardContainer = this.createCardUI(card, x, cardY, cardWidth, cardHeight);
      this.handCards.push(cardContainer);
    });
  }

  private createCardUI(
    card: Card,
    x: number,
    y: number,
    width: number,
    height: number
  ): Phaser.GameObjects.Container {
    // Card background color based on type
    let bgColor = 0x4a4a4a;
    if (card.type === 'Attack') bgColor = 0x8b0000;
    if (card.type === 'Skill') bgColor = 0x006400;
    if (card.type === 'Power') bgColor = 0x4b0082;

    // Background
    const bg = this.add.rectangle(0, 0, width, height, bgColor);
    bg.setStrokeStyle(2, 0xffffff);

    // Card name
    const nameText = this.add.text(0, -height / 2 + 20, card.name, {
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold',
      wordWrap: { width: width - 10 },
      align: 'center',
    });
    nameText.setOrigin(0.5);

    // Cost
    const costBg = this.add.circle(-width / 2 + 15, -height / 2 + 15, 12, 0xf9ca24);
    const costText = this.add.text(-width / 2 + 15, -height / 2 + 15, card.cost.toString(), {
      fontSize: '14px',
      color: '#000000',
      fontStyle: 'bold',
    });
    costText.setOrigin(0.5);

    // Description
    let desc = card.description;
    if (card.damage) desc = desc.replace('{damage}', card.damage.toString());
    if (card.block) desc = desc.replace('{block}', card.block.toString());

    const descText = this.add.text(0, 10, desc, {
      fontSize: '11px',
      color: '#dddddd',
      wordWrap: { width: width - 20 },
      align: 'center',
    });
    descText.setOrigin(0.5);

    // Type
    const typeText = this.add.text(0, height / 2 - 15, card.type, {
      fontSize: '10px',
      color: '#999999',
    });
    typeText.setOrigin(0.5);

    // Container
    const container = this.add.container(x, y, [bg, nameText, costBg, costText, descText, typeText]);
    container.setSize(width, height);
    container.setInteractive({ useHandCursor: true });

    // Hover effect
    container.on('pointerover', () => {
      this.tweens.add({
        targets: container,
        y: y - 20,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
      });
      bg.setStrokeStyle(3, 0xffff00);
    });

    container.on('pointerout', () => {
      this.tweens.add({
        targets: container,
        y: y,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
      bg.setStrokeStyle(2, 0xffffff);
    });

    // Click to select
    container.on('pointerdown', () => {
      this.selectedCard = card;
      console.log(`Selected card: ${card.name}`);

      // If card doesn't need target, play immediately
      if (card.targetType === 'Self') {
        this.playSelectedCard();
      } else if (this.combatManager.enemies.length === 1) {
        // Auto-target if only one enemy
        this.selectedEnemy = this.combatManager.enemies[0];
        this.playSelectedCard();
      }
    });

    return container;
  }

  private createEndTurnButton(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const btnWidth = 150;
    const btnHeight = 50;
    const x = width - btnWidth / 2 - 30;
    const y = height - btnHeight / 2 - 30;

    const bg = this.add.rectangle(0, 0, btnWidth, btnHeight, 0x27ae60);
    bg.setStrokeStyle(2, 0xffffff);
    bg.setInteractive({ useHandCursor: true });

    const text = this.add.text(0, 0, 'End Turn', {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    text.setOrigin(0.5);

    this.add.container(x, y, [bg, text]);

    bg.on('pointerover', () => {
      bg.setFillStyle(0x2ecc71);
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(0x27ae60);
    });

    bg.on('pointerdown', () => {
      this.endTurn();
    });
  }

  private playSelectedCard(): void {
    if (!this.selectedCard) return;

    const success = this.combatManager.playCard(this.selectedCard, this.selectedEnemy || undefined);

    if (success) {
      this.selectedCard = null;
      this.selectedEnemy = null;
      this.updateAllUI();

      // Check for combat end
      if (this.combatManager.phase === 'Victory') {
        this.showVictory();
      } else if (this.combatManager.phase === 'Defeat') {
        this.showDefeat();
      }
    } else {
      console.log('Failed to play card');
    }
  }

  private endTurn(): void {
    this.combatManager.endPlayerTurn();
    this.selectedCard = null;
    this.selectedEnemy = null;

    // Wait a bit to show enemy actions
    this.time.delayedCall(1000, () => {
      this.updateAllUI();

      // Check for combat end
      if (this.combatManager.phase === 'Defeat') {
        this.showDefeat();
      }
    });
  }

  private updateAllUI(): void {
    this.updatePlayerUI();
    this.updateEnemyUI();
    this.updateDeckUI();
    this.updateHandUI();
    this.turnText.setText(`Turn: ${this.combatManager.turn}`);
  }

  private updatePlayerUI(): void {
    const player = this.combatManager.player;
    this.playerHpText.setText(`HP: ${player.currentHp}/${player.maxHp}`);
    this.playerBlockText.setText(player.block > 0 ? `🛡️ ${player.block}` : '');
    this.playerEnergyText.setText(`⚡ ${player.currentEnergy}/${player.maxEnergy}`);
  }

  private updateEnemyUI(): void {
    this.combatManager.enemies.forEach((enemy, index) => {
      if (enemy.isDead()) {
        this.enemyHpTexts[index].setText('DEAD');
        this.enemyHpTexts[index].setColor('#666666');
        this.enemyBlockTexts[index].setText('');
        this.enemyIntentTexts[index].setText('');
      } else {
        this.enemyHpTexts[index].setText(`HP: ${enemy.currentHp}/${enemy.maxHp}`);
        this.enemyBlockTexts[index].setText(enemy.block > 0 ? `🛡️ ${enemy.block}` : '');

        let intentText = '';
        switch (enemy.intent) {
          case 'Attack':
            intentText = `⚔️ ${enemy.nextDamage}`;
            break;
          case 'Defend':
            intentText = `🛡️ ${enemy.nextBlock}`;
            break;
          case 'Buff':
            intentText = '💪 Buff';
            break;
        }
        this.enemyIntentTexts[index].setText(intentText);
      }
    });
  }

  private updateDeckUI(): void {
    this.drawPileText.setText(`${this.combatManager.player.drawPile.length} cards`);
    this.discardPileText.setText(`${this.combatManager.player.discardPile.length} cards`);
  }

  private showVictory(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

    const text = this.add.text(width / 2, height / 2, '🎉 VICTORY! 🎉', {
      fontSize: '48px',
      color: '#00ff00',
      fontStyle: 'bold',
    });
    text.setOrigin(0.5);

    const backText = this.add.text(width / 2, height / 2 + 80, 'Click to return to menu', {
      fontSize: '20px',
      color: '#ffffff',
    });
    backText.setOrigin(0.5);

    overlay.setInteractive();
    overlay.on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });
  }

  private showDefeat(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

    const text = this.add.text(width / 2, height / 2, '💀 DEFEAT 💀', {
      fontSize: '48px',
      color: '#ff0000',
      fontStyle: 'bold',
    });
    text.setOrigin(0.5);

    const backText = this.add.text(width / 2, height / 2 + 80, 'Click to return to menu', {
      fontSize: '20px',
      color: '#ffffff',
    });
    backText.setOrigin(0.5);

    overlay.setInteractive();
    overlay.on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });
  }

  update(): void {
    // Update FPS counter
    const fps = Math.round(this.game.loop.actualFps);
    this.fpsText.setText(`FPS: ${fps}`);
  }

  private createBackButton(): void {
    const backButton = this.add.text(20, 680, '← Back to Menu', {
      fontSize: '16px',
      color: '#aaaaaa',
      backgroundColor: '#333333',
      padding: { x: 15, y: 10 },
    });

    backButton.setInteractive({ useHandCursor: true });

    backButton.on('pointerover', () => {
      backButton.setColor('#ffffff');
    });

    backButton.on('pointerout', () => {
      backButton.setColor('#aaaaaa');
    });

    backButton.on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });
  }
}
