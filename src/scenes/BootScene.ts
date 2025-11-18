import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Create loading bar
    this.createLoadingBar();

    // TODO: Load assets here when we have them
    // this.load.image('logo', 'assets/ui/logo.png');
  }

  create(): void {
    console.log('✅ Boot scene loaded');

    // Transition to main menu
    this.scene.start('MainMenuScene');
  }

  private createLoadingBar(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Loading text
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '32px',
      color: '#ffffff',
    });
    loadingText.setOrigin(0.5);

    // Progress bar background
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2, 320, 50);

    // Loading percentage text
    const percentText = this.add.text(width / 2, height / 2 + 25, '0%', {
      fontSize: '18px',
      color: '#ffffff',
    });
    percentText.setOrigin(0.5);

    // Update loading bar
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x00ff00, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 + 10, 300 * value, 30);
      percentText.setText(`${Math.floor(value * 100)}%`);
    });

    // Complete handler
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });
  }
}
