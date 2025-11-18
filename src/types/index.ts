// ============================================================
// CORE TYPES
// ============================================================

export enum CardType {
  Attack = 'Attack',
  Skill = 'Skill',
  Power = 'Power',
}

export enum CardRarity {
  Basic = 'Basic',
  Common = 'Common',
  Uncommon = 'Uncommon',
  Rare = 'Rare',
}

export enum TargetType {
  SingleEnemy = 'SingleEnemy',
  AllEnemies = 'AllEnemies',
  Self = 'Self',
  RandomEnemy = 'RandomEnemy',
}

export enum EnemyIntent {
  Attack = 'Attack',
  Defend = 'Defend',
  Buff = 'Buff',
  Debuff = 'Debuff',
  Unknown = 'Unknown',
  Sleep = 'Sleep',
}

// ============================================================
// EFFECTS & BUFFS/DEBUFFS
// ============================================================

export enum EffectType {
  // Buffs
  Strength = 'Strength',
  Dexterity = 'Dexterity',
  Regeneration = 'Regeneration',
  Artifact = 'Artifact',
  Intangible = 'Intangible',

  // Debuffs
  Vulnerable = 'Vulnerable',
  Weak = 'Weak',
  Frail = 'Frail',
  Poison = 'Poison',

  // Special
  Block = 'Block',
}

export interface Effect {
  type: EffectType;
  amount: number;
}

// ============================================================
// CARD INTERFACE
// ============================================================

export interface CardData {
  id: string;
  name: string;
  description: string;
  type: CardType;
  rarity: CardRarity;
  cost: number;
  upgraded: boolean;
  damage?: number;
  block?: number;
  effects?: Effect[];
  targetType: TargetType;
}

// ============================================================
// CHARACTER INTERFACE
// ============================================================

export interface CharacterData {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  maxEnergy: number;
  currentEnergy: number;
  block: number;
  effects: Effect[];
  deck: CardData[];
  drawPile: CardData[];
  hand: CardData[];
  discardPile: CardData[];
  exhaustPile: CardData[];
}

// ============================================================
// ENEMY INTERFACE
// ============================================================

export interface EnemyData {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  block: number;
  effects: Effect[];
  intent: EnemyIntent;
  nextDamage?: number;
  nextBlock?: number;
}

// ============================================================
// COMBAT STATE
// ============================================================

export enum CombatPhase {
  Start = 'Start',
  PlayerTurn = 'PlayerTurn',
  EnemyTurn = 'EnemyTurn',
  Victory = 'Victory',
  Defeat = 'Defeat',
}

export interface CombatState {
  phase: CombatPhase;
  turn: number;
  player: CharacterData;
  enemies: EnemyData[];
}
