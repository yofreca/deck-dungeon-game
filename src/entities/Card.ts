import { CardData, CardType, CardRarity, TargetType, Effect } from '@/types';

export class Card {
  public id: string;
  public name: string;
  public description: string;
  public type: CardType;
  public rarity: CardRarity;
  public cost: number;
  public upgraded: boolean;
  public damage?: number;
  public block?: number;
  public effects?: Effect[];
  public targetType: TargetType;

  constructor(data: CardData) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.type = data.type;
    this.rarity = data.rarity;
    this.cost = data.cost;
    this.upgraded = data.upgraded;
    this.damage = data.damage;
    this.block = data.block;
    this.effects = data.effects;
    this.targetType = data.targetType;
  }

  /**
   * Get the actual damage value considering upgrades
   */
  public getDamage(): number {
    return this.damage || 0;
  }

  /**
   * Get the actual block value considering upgrades
   */
  public getBlock(): number {
    return this.block || 0;
  }

  /**
   * Upgrade this card (increase damage/block, reduce cost, etc.)
   */
  public upgrade(): void {
    if (this.upgraded) {
      return;
    }

    this.upgraded = true;

    // Increase damage by 3 if it's an attack
    if (this.type === CardType.Attack && this.damage) {
      this.damage += 3;
    }

    // Increase block by 2 if it has block
    if (this.block) {
      this.block += 2;
    }

    // Add + to the name
    this.name = `${this.name}+`;
  }

  /**
   * Check if this card can be played with the given energy
   */
  public canPlay(currentEnergy: number): boolean {
    return currentEnergy >= this.cost;
  }

  /**
   * Clone this card (useful for adding to deck)
   */
  public clone(): Card {
    return new Card({
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      rarity: this.rarity,
      cost: this.cost,
      upgraded: this.upgraded,
      damage: this.damage,
      block: this.block,
      effects: this.effects ? [...this.effects] : undefined,
      targetType: this.targetType,
    });
  }

  /**
   * Get card data for serialization
   */
  public toData(): CardData {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      rarity: this.rarity,
      cost: this.cost,
      upgraded: this.upgraded,
      damage: this.damage,
      block: this.block,
      effects: this.effects,
      targetType: this.targetType,
    };
  }
}
