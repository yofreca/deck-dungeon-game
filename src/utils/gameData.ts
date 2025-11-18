import { CharacterData, EnemyData, CardData, EnemyIntent, CardType, CardRarity, TargetType } from '@/types';
import ironcladCardsRaw from '@/data/cards/ironclad.json';

// Cast JSON data to CardData with proper types
const ironcladCards = ironcladCardsRaw.map((card: any) => ({
  ...card,
  type: card.type as CardType,
  rarity: card.rarity as CardRarity,
  targetType: card.targetType as TargetType,
})) as CardData[];

/**
 * Create initial Ironclad (Warrior) character data
 */
export function createIroncladCharacter(): CharacterData {
  // Starter deck: 5x Strike, 4x Defend, 1x Bash
  const starterDeck: CardData[] = [
    ...Array(5)
      .fill(null)
      .map(() => ({ ...ironcladCards[0] })), // 5x Strike
    ...Array(4)
      .fill(null)
      .map(() => ({ ...ironcladCards[1] })), // 4x Defend
    { ...ironcladCards[2] }, // 1x Bash
  ];

  return {
    id: 'ironclad',
    name: 'Ironclad',
    maxHp: 80,
    currentHp: 80,
    maxEnergy: 3,
    currentEnergy: 3,
    block: 0,
    effects: [],
    deck: starterDeck,
    drawPile: [],
    hand: [],
    discardPile: [],
    exhaustPile: [],
  };
}

/**
 * Create a Cultist enemy
 */
export function createCultistEnemy(): EnemyData {
  return {
    id: 'cultist',
    name: 'Cultist',
    maxHp: 50,
    currentHp: 50,
    block: 0,
    effects: [],
    intent: EnemyIntent.Attack,
    nextDamage: 6,
  };
}

/**
 * Create a Jaw Worm enemy
 */
export function createJawWormEnemy(): EnemyData {
  return {
    id: 'jaw_worm',
    name: 'Jaw Worm',
    maxHp: 44,
    currentHp: 44,
    block: 0,
    effects: [],
    intent: EnemyIntent.Attack,
    nextDamage: 8,
  };
}

/**
 * Create a Looter enemy
 */
export function createLooterEnemy(): EnemyData {
  return {
    id: 'looter',
    name: 'Looter',
    maxHp: 46,
    currentHp: 46,
    block: 0,
    effects: [],
    intent: EnemyIntent.Attack,
    nextDamage: 10,
  };
}

/**
 * Create random Act 1 enemy encounter
 */
export function createRandomAct1Encounter(): EnemyData[] {
  const rand = Math.random();

  if (rand < 0.33) {
    return [createCultistEnemy()];
  } else if (rand < 0.66) {
    return [createJawWormEnemy()];
  } else {
    return [createLooterEnemy()];
  }
}
