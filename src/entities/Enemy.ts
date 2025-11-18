import { EnemyData, EnemyIntent, Effect, EffectType } from '@/types';

export class Enemy {
  public id: string;
  public name: string;
  public maxHp: number;
  public currentHp: number;
  public block: number;
  public effects: Effect[];
  public intent: EnemyIntent;
  public nextDamage?: number;
  public nextBlock?: number;

  constructor(data: EnemyData) {
    this.id = data.id;
    this.name = data.name;
    this.maxHp = data.maxHp;
    this.currentHp = data.currentHp;
    this.block = data.block;
    this.effects = data.effects || [];
    this.intent = data.intent;
    this.nextDamage = data.nextDamage;
    this.nextBlock = data.nextBlock;
  }

  /**
   * Take damage, considering block and effects
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

    // Apply Frail (25% less block)
    if (this.hasEffect(EffectType.Frail)) {
      blockToGain = Math.floor(blockToGain * 0.75);
    }

    this.block += blockToGain;
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
   * Calculate actual damage considering Strength and Weak
   */
  public calculateDamage(baseDamage: number): number {
    let damage = baseDamage;

    // Apply Strength (bonus damage)
    const strength = this.getEffectAmount(EffectType.Strength);
    damage += strength;

    // Apply Weak (25% less damage)
    if (this.hasEffect(EffectType.Weak)) {
      damage = Math.floor(damage * 0.75);
    }

    return Math.max(0, damage);
  }

  /**
   * Start of turn effects
   */
  public onTurnStart(): void {
    // Lose all block at turn start
    this.block = 0;

    // Apply Poison damage
    const poison = this.getEffectAmount(EffectType.Poison);
    if (poison > 0) {
      this.currentHp -= poison;
      if (this.currentHp < 0) this.currentHp = 0;
      this.removeEffect(EffectType.Poison, 1);
    }
  }

  /**
   * Check if enemy is dead
   */
  public isDead(): boolean {
    return this.currentHp <= 0;
  }

  /**
   * Set next action (intent)
   */
  public setIntent(intent: EnemyIntent, damage?: number, block?: number): void {
    this.intent = intent;
    this.nextDamage = damage;
    this.nextBlock = block;
  }

  /**
   * Execute the enemy's action based on intent
   */
  public executeAction(): { intent: EnemyIntent; damage?: number; block?: number } {
    const result = {
      intent: this.intent,
      damage: this.nextDamage,
      block: this.nextBlock,
    };

    switch (this.intent) {
      case EnemyIntent.Defend:
        if (this.nextBlock) {
          this.gainBlock(this.nextBlock);
        }
        break;

      case EnemyIntent.Buff:
        // Add strength (example)
        this.addEffect(EffectType.Strength, 1);
        break;
    }

    return result;
  }
}
