import Phaser from 'phaser';

export class MapScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MapScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    this.cameras.main.setBackgroundColor('#0f3460');

    // Title
    const title = this.add.text(width / 2, 60, 'MAP', {
      fontSize: '48px',
      color: '#ff6b6b',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    // Placeholder text
    const placeholderText = this.add.text(
      width / 2,
      height / 2,
      'Procedural map generation coming soon...\n\nYou will navigate through nodes here!',
      {
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
      }
    );
    placeholderText.setOrigin(0.5);

    // Back button
    this.createBackButton();

    console.log('✅ Map scene loaded');
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
