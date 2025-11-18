import Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Title
    const title = this.add.text(width / 2, height / 4, 'DECK DUNGEON', {
      fontSize: '64px',
      color: '#ff6b6b',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(width / 2, height / 4 + 80, 'Roguelike Deckbuilder', {
      fontSize: '24px',
      color: '#aaaaaa',
    });
    subtitle.setOrigin(0.5);

    // Play button
    this.createButton(width / 2, height / 2 + 50, 'Play', () => {
      this.scene.start('CombatScene');
    });

    // Continue button (disabled for now)
    const continueBtn = this.createButton(width / 2, height / 2 + 130, 'Continue', () => {
      console.log('Continue clicked (not implemented yet)');
    });
    continueBtn.setAlpha(0.5); // Disabled look

    // Settings button
    this.createButton(width / 2, height / 2 + 210, 'Settings', () => {
      console.log('Settings clicked (not implemented yet)');
    });

    // Version text
    this.add.text(20, height - 30, 'v0.1.0-alpha', {
      fontSize: '14px',
      color: '#666666',
    });

    console.log('✅ Main menu scene loaded');
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    callback: () => void
  ): Phaser.GameObjects.Container {
    const buttonWidth = 300;
    const buttonHeight = 60;

    // Button background
    const bg = this.add.rectangle(0, 0, buttonWidth, buttonHeight, 0x4a4a4a);
    bg.setStrokeStyle(2, 0x6b6b6b);
    bg.setInteractive({ useHandCursor: true });

    // Button text
    const buttonText = this.add.text(0, 0, text, {
      fontSize: '28px',
      color: '#ffffff',
    });
    buttonText.setOrigin(0.5);

    // Container
    const container = this.add.container(x, y, [bg, buttonText]);

    // Hover effects
    bg.on('pointerover', () => {
      bg.setFillStyle(0x5a5a5a);
      this.tweens.add({
        targets: container,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
      });
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(0x4a4a4a);
      this.tweens.add({
        targets: container,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
    });

    bg.on('pointerdown', () => {
      this.tweens.add({
        targets: container,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: callback,
      });
    });

    return container;
  }
}
