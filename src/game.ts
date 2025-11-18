import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { CombatScene } from './scenes/CombatScene';
import { MapScene } from './scenes/MapScene';

export class Game extends Phaser.Game {
  constructor() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1280,
      height: 720,
      parent: 'game-container',
      backgroundColor: '#1a1a2e',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        },
      },
      scene: [
        BootScene,
        MainMenuScene,
        CombatScene,
        MapScene,
      ],
    };

    super(config);
  }
}
