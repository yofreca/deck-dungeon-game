import Phaser from 'phaser';

export class CombatScene extends Phaser.Scene {
  private fpsText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'CombatScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    this.cameras.main.setBackgroundColor('#16213e');

    // Title
    const title = this.add.text(width / 2, 60, 'COMBAT SCENE', {
      fontSize: '48px',
      color: '#ff6b6b',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    // Placeholder text
    const placeholderText = this.add.text(
      width / 2,
      height / 2,
      'Combat system coming soon...\n\nThis is where the card battle will happen!',
      {
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
      }
    );
    placeholderText.setOrigin(0.5);

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

  update(): void {
    // Update FPS counter
    const fps = Math.round(this.game.loop.actualFps);
    this.fpsText.setText(`FPS: ${fps}`);
  }

  private createBackButton(): void {
    const backButton = this.add.text(20, 680, '← Back to Menu', {
      fontSize: '20px',
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
