import { CharacterData, Effect, EffectType } from '@/types';
import { Card } from './Card';

export class Character {
  public id: string;
  public name: string;
  public maxHp: number;
  public currentHp: number;
  public maxEnergy: number;
  public currentEnergy: number;
  public block: number;
  public effects: Effect[];

  // Deck management
  public deck: Card[];
  public drawPile: Card[];
  public hand: Card[];
  public discardPile: Card[];
  public exhaustPile: Card[];

  constructor(data: CharacterData) {
    this.id = data.id;
    this.name = data.name;
    this.maxHp = data.maxHp;
    this.currentHp = data.currentHp;
    this.maxEnergy = data.maxEnergy;
    this.currentEnergy = data.currentEnergy;
    this.block = data.block;
    this.effects = data.effects || [];

    // Initialize deck from card data
    this.deck = data.deck.map((cardData) => new Card(cardData));
    this.drawPile = data.drawPile.map((cardData) => new Card(cardData));
    this.hand = data.hand.map((cardData) => new Card(cardData));
    this.discardPile = data.discardPile.map((cardData) => new Card(cardData));
    this.exhaustPile = data.exhaustPile.map((cardData) => new Card(cardData));
  }

  /**
   * Take damage, considering block
   */
  public takeDamage(amount: number): number {
    let damageToTake = amount;

    // Apply Vulnerable (50% more damage)
    if (this.hasEffect(EffectType.Vulnerable)) {
      damageToTake = Math.floor(damageToTake * 1.5);
    }

    // Apply Intangible (reduce to 1 damage)
    if (this.hasEffect(EffectType.Intangible)) {
      damageToTake = 1;
      this.removeEffect(EffectType.Intangible, 1);
    }

    // Block absorbs damage first
    if (this.block > 0) {
      if (this.block >= damageToTake) {
        this.block -= damageToTake;
        return 0;
      } else {
        damageToTake -= this.block;
        this.block = 0;
      }
    }

    // Apply remaining damage to HP
    this.currentHp -= damageToTake;
    if (this.currentHp < 0) {
      this.currentHp = 0;
    }

    return damageToTake;
  }

  /**
   * Gain block
   */
  public gainBlock(amount: number): void {
    let blockToGain = amount;

    // Apply Dexterity (bonus block)
    const dexterity = this.getEffectAmount(EffectType.Dexterity);
    blockToGain += dexterity;

    // Apply Frail (25% less block)
    if (this.hasEffect(EffectType.Frail)) {
      blockToGain = Math.floor(blockToGain * 0.75);
    }

    this.block += blockToGain;
  }

  /**
   * Heal HP
   */
  public heal(amount: number): void {
    this.currentHp += amount;
    if (this.currentHp > this.maxHp) {
      this.currentHp = this.maxHp;
    }
  }

  /**
   * Restore energy to max
   */
  public restoreEnergy(): void {
    this.currentEnergy = this.maxEnergy;
  }

  /**
   * Spend energy
   */
  public spendEnergy(amount: number): boolean {
    if (this.currentEnergy >= amount) {
      this.currentEnergy -= amount;
      return true;
    }
    return false;
  }

  /**
   * Add an effect (buff/debuff)
   */
  public addEffect(type: EffectType, amount: number): void {
    // Check for Artifact (negates debuffs)
    if (this.hasEffect(EffectType.Artifact)) {
      const isDebuff = [
        EffectType.Vulnerable,
        EffectType.Weak,
        EffectType.Frail,
        EffectType.Poison,
      ].includes(type);

      if (isDebuff) {
        this.removeEffect(EffectType.Artifact, 1);
        return;
      }
    }

    const existingEffect = this.effects.find((e) => e.type === type);
    if (existingEffect) {
      existingEffect.amount += amount;
    } else {
      this.effects.push({ type, amount });
    }
  }

  /**
   * Remove an effect
   */
  public removeEffect(type: EffectType, amount: number): void {
    const effect = this.effects.find((e) => e.type === type);
    if (effect) {
      effect.amount -= amount;
      if (effect.amount <= 0) {
        this.effects = this.effects.filter((e) => e.type !== type);
      }
    }
  }

  /**
   * Check if has effect
   */
  public hasEffect(type: EffectType): boolean {
    return this.effects.some((e) => e.type === type && e.amount > 0);
  }

  /**
   * Get effect amount
   */
  public getEffectAmount(type: EffectType): number {
    const effect = this.effects.find((e) => e.type === type);
    return effect ? effect.amount : 0;
  }

  /**
   * Start of turn effects
   */
  public onTurnStart(): void {
    // Lose all block at turn start
    this.block = 0;

    // Restore energy
    this.restoreEnergy();

    // Apply Regeneration
    const regen = this.getEffectAmount(EffectType.Regeneration);
    if (regen > 0) {
      this.heal(regen);
    }

    // Apply Poison damage
    const poison = this.getEffectAmount(EffectType.Poison);
    if (poison > 0) {
      this.currentHp -= poison;
      if (this.currentHp < 0) this.currentHp = 0;
      this.removeEffect(EffectType.Poison, 1);
    }
  }

  /**
   * Check if character is dead
   */
  public isDead(): boolean {
    return this.currentHp <= 0;
  }

  /**
   * Draw cards from draw pile
   */
  public drawCards(count: number): void {
    for (let i = 0; i < count; i++) {
      if (this.drawPile.length === 0) {
        this.shuffleDiscardIntoDraw();
      }

      if (this.drawPile.length > 0) {
        const card = this.drawPile.shift()!;
        this.hand.push(card);
      }
    }
  }

  /**
   * Shuffle discard pile into draw pile
   */
  public shuffleDiscardIntoDraw(): void {
    if (this.discardPile.length === 0) return;

    this.drawPile = [...this.discardPile];
    this.discardPile = [];

    // Shuffle using Fisher-Yates algorithm
    for (let i = this.drawPile.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.drawPile[i], this.drawPile[j]] = [this.drawPile[j], this.drawPile[i]];
    }
  }

  /**
   * Play a card from hand
   */
  public playCard(card: Card): boolean {
    if (!card.canPlay(this.currentEnergy)) {
      return false;
    }

    const cardIndex = this.hand.indexOf(card);
    if (cardIndex === -1) {
      return false;
    }

    // Remove from hand
    this.hand.splice(cardIndex, 1);

    // Spend energy
    this.spendEnergy(card.cost);

    // Card goes to discard pile after being played
    this.discardPile.push(card);

    return true;
  }

  /**
   * Discard entire hand
   */
  public discardHand(): void {
    this.discardPile.push(...this.hand);
    this.hand = [];
  }
}
