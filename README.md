# Deck Dungeon

A roguelike deckbuilder game for web, inspired by Slay the Spire.

## 🎮 About

Deck Dungeon is a strategic roguelike card game where you build and refine your deck as you progress through procedurally generated dungeons. Face challenging enemies in turn-based card battles, collect powerful relics, and create devastating synergies.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Development

### Scripts

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint TypeScript files
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier

### Tech Stack

- **Framework:** Phaser 3 (game engine)
- **Language:** TypeScript
- **Build Tool:** Vite
- **Linting:** ESLint
- **Formatting:** Prettier

## 📁 Project Structure

```
deck-dungeon-game/
├── public/               # Static assets
│   └── assets/          # Game assets (sprites, audio, etc.)
├── src/
│   ├── scenes/          # Phaser scenes
│   ├── core/            # Core game logic
│   ├── entities/        # Game entities (Card, Character, Enemy, etc.)
│   ├── data/            # Game data (JSON)
│   ├── systems/         # Game systems (Effects, AI, etc.)
│   ├── ui/              # UI components
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript types
└── index.html           # Entry HTML file
```

## 🎯 Features (Planned)

### Phase 1: Combat Prototype ✅
- [x] Project setup with Vite + TypeScript + Phaser 3
- [x] Basic scene structure (Boot, MainMenu, Combat, Map)
- [x] FPS counter and asset loading system
- [ ] Core combat mechanics (energy, damage, block)
- [ ] Basic card system (10 cards)
- [ ] Simple enemy AI

### Phase 2: Run Loop
- [ ] Procedural map generation
- [ ] Reward system (cards, gold)
- [ ] Boss fights
- [ ] Relics system

### Phase 3: Expanded Content
- [ ] Multiple characters (Warrior, Assassin, Mage, Cleric)
- [ ] 60+ unique cards per character
- [ ] 10+ varied enemies
- [ ] Events and merchants

### Phase 4: Advanced Systems
- [ ] Unique character mechanics (Orbs, Stances)
- [ ] Act 2 & 3
- [ ] Potion system
- [ ] Advanced balancing

### Phase 5: Polish
- [ ] Final art and animations
- [ ] Music and SFX
- [ ] Tutorial system
- [ ] Tooltips and UX improvements

### Phase 6: Meta-Progression
- [ ] Ascension system
- [ ] Unlockable cards and relics
- [ ] Achievements
- [ ] Daily runs

## 📖 Game Design Document

See [deck-dungeon-game-design.md](./deck-dungeon-game-design.md) for the complete game design document.

## 📝 License

ISC

## 🤝 Contributing

This is a personal project currently in active development. Contributions, issues, and feature requests are welcome!

---

**Current Version:** 0.1.0-alpha
**Status:** 🚧 In Development - Phase 1
