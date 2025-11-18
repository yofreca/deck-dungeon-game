import { Character } from '@/entities/Character';
import { Enemy } from '@/entities/Enemy';
import { Card } from '@/entities/Card';
import { CombatPhase, CombatState, CardType, EffectType, EnemyIntent } from '@/types';

export class CombatManager {
  public player: Character;
  public enemies: Enemy[];
  public phase: CombatPhase;
  public turn: number;

  constructor(player: Character, enemies: Enemy[]) {
    this.player = player;
    this.enemies = enemies;
    this.phase = CombatPhase.Start;
    this.turn = 0;
  }

  /**
   * Start the combat
   */
  public startCombat(): void {
    this.phase = CombatPhase.PlayerTurn;
    this.turn = 1;

    // Initialize draw pile from deck
    this.player.drawPile = [...this.player.deck];
    this.player.hand = [];
    this.player.discardPile = [];
    this.player.exhaustPile = [];

    // Shuffle draw pile
    this.player.shuffleDiscardIntoDraw();

    // Draw initial hand (5 cards)
    this.player.drawCards(5);

    // Restore player energy
    this.player.restoreEnergy();

    // Set initial enemy intents
    this.enemies.forEach((enemy) => {
      this.setEnemyIntent(enemy);
    });

    console.log('⚔️ Combat started!');
  }

  /**
   * Start player turn
   */
  public startPlayerTurn(): void {
    this.phase = CombatPhase.PlayerTurn;
    this.turn++;

    // Apply start of turn effects
    this.player.onTurnStart();

    // Draw cards up to hand size (5)
    const cardsToDraw = 5 - this.player.hand.length;
    this.player.drawCards(cardsToDraw);

    console.log(`🎴 Player turn ${this.turn} started`);
  }

  /**
   * End player turn and start enemy turn
   */
  public endPlayerTurn(): void {
    if (this.phase !== CombatPhase.PlayerTurn) {
      return;
    }

    // Discard remaining hand
    this.player.discardHand();

    // Start enemy turn
    this.phase = CombatPhase.EnemyTurn;
    this.executeEnemyTurn();
  }

  /**
   * Execute enemy turn
   */
  private executeEnemyTurn(): void {
    console.log('👹 Enemy turn started');

    // Each enemy executes their action
    this.enemies.forEach((enemy) => {
      if (enemy.isDead()) return;

      enemy.onTurnStart();

      const action = enemy.executeAction();

      switch (action.intent) {
        case 'Attack':
          if (action.damage) {
            const actualDamage = enemy.calculateDamage(action.damage);
            const damageTaken = this.player.takeDamage(actualDamage);
            console.log(`${enemy.name} attacked for ${damageTaken} damage`);
          }
          break;

        case 'Defend':
          console.log(`${enemy.name} defended for ${action.block} block`);
          break;

        case 'Buff':
          console.log(`${enemy.name} buffed themselves`);
          break;
      }

      // Set next intent for next turn
      this.setEnemyIntent(enemy);
    });

    // Check if player died
    if (this.player.isDead()) {
      this.phase = CombatPhase.Defeat;
      console.log('💀 Player defeated!');
      return;
    }

    // Start new player turn
    this.startPlayerTurn();
  }

  /**
   * Play a card
   */
  public playCard(card: Card, targetEnemy?: Enemy): boolean {
    if (this.phase !== CombatPhase.PlayerTurn) {
      console.log('Not player turn!');
      return false;
    }

    if (!this.player.playCard(card)) {
      console.log('Cannot play card (not enough energy or card not in hand)');
      return false;
    }

    console.log(`🃏 Played ${card.name}`);

    // Execute card effects
    this.executeCardEffects(card, targetEnemy);

    // Check if all enemies are dead
    if (this.enemies.every((e) => e.isDead())) {
      this.phase = CombatPhase.Victory;
      console.log('🎉 Victory!');
    }

    return true;
  }

  /**
   * Execute card effects
   */
  private executeCardEffects(card: Card, targetEnemy?: Enemy): void {
    switch (card.type) {
      case CardType.Attack:
        if (targetEnemy && card.damage) {
          let damage = card.damage;

          // Apply player Strength
          const strength = this.player.getEffectAmount(EffectType.Strength);
          damage += strength;

          // Apply Weak
          if (this.player.hasEffect(EffectType.Weak)) {
            damage = Math.floor(damage * 0.75);
          }

          const damageTaken = targetEnemy.takeDamage(damage);
          console.log(`  → Dealt ${damageTaken} damage to ${targetEnemy.name}`);

          if (targetEnemy.isDead()) {
            console.log(`  💀 ${targetEnemy.name} defeated!`);
          }
        }
        break;

      case CardType.Skill:
        if (card.block) {
          this.player.gainBlock(card.block);
          console.log(`  🛡️ Gained ${card.block} block`);
        }

        // Apply effects
        if (card.effects && targetEnemy) {
          card.effects.forEach((effect) => {
            targetEnemy.addEffect(effect.type, effect.amount);
            console.log(`  → Applied ${effect.amount} ${effect.type} to ${targetEnemy.name}`);
          });
        }
        break;

      case CardType.Power:
        // Powers stay in play (not implemented yet, simplified for now)
        if (card.effects) {
          card.effects.forEach((effect) => {
            this.player.addEffect(effect.type, effect.amount);
            console.log(`  ✨ Gained ${effect.amount} ${effect.type}`);
          });
        }
        break;
    }
  }

  /**
   * Set enemy intent for next turn (simplified AI)
   */
  private setEnemyIntent(enemy: Enemy): void {
    // Simple AI: 70% attack, 20% defend, 10% buff
    const rand = Math.random();

    if (rand < 0.7) {
      // Attack
      const damage = 6 + Math.floor(Math.random() * 4); // 6-9 damage
      enemy.setIntent(EnemyIntent.Attack, damage);
    } else if (rand < 0.9) {
      // Defend
      const block = 5 + Math.floor(Math.random() * 3); // 5-7 block
      enemy.setIntent(EnemyIntent.Defend, undefined, block);
    } else {
      // Buff
      enemy.setIntent(EnemyIntent.Buff);
    }
  }

  /**
   * Get combat state
   */
  public getState(): CombatState {
    return {
      phase: this.phase,
      turn: this.turn,
      player: {
        id: this.player.id,
        name: this.player.name,
        maxHp: this.player.maxHp,
        currentHp: this.player.currentHp,
        maxEnergy: this.player.maxEnergy,
        currentEnergy: this.player.currentEnergy,
        block: this.player.block,
        effects: this.player.effects,
        deck: this.player.deck.map((c) => c.toData()),
        drawPile: this.player.drawPile.map((c) => c.toData()),
        hand: this.player.hand.map((c) => c.toData()),
        discardPile: this.player.discardPile.map((c) => c.toData()),
        exhaustPile: this.player.exhaustPile.map((c) => c.toData()),
      },
      enemies: this.enemies.map((e) => ({
        id: e.id,
        name: e.name,
        maxHp: e.maxHp,
        currentHp: e.currentHp,
        block: e.block,
        effects: e.effects,
        intent: e.intent,
        nextDamage: e.nextDamage,
        nextBlock: e.nextBlock,
      })),
    };
  }
}
