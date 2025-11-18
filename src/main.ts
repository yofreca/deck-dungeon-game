import { Game } from './game';

// Initialize the game when DOM is ready
window.addEventListener('load', () => {
  const game = new Game();

  // Make game instance globally accessible for debugging
  (window as any).game = game;

  console.log('🎮 Deck Dungeon initialized');
});
