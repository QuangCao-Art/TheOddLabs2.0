import { CARDS } from '../data/cards.js';
import { gameState } from './state.js';

export const ELEMENTAL_TABLE = {
    THERMOGENIC: { BOTANIC: 1.5, KERATINIZED: 1.5, OSMOTIC: 0.75 },
    OSMOTIC: { THERMOGENIC: 1.5, BOTANIC: 0.75, ELECTROLYTIC: 0.75 },
    BOTANIC: { OSMOTIC: 1.5, THERMOGENIC: 0.75, KERATINIZED: 0.75, VIRAL: 0.75 },
    ELECTROLYTIC: { OSMOTIC: 1.5, KERATINIZED: 1.5, BOTANIC: 0.75 },
    VIRAL: { BOTANIC: 1.5, KERATINIZED: 0.75 },
    APOPTOTIC: { APOPTOTIC: 1.5 },
    KERATINIZED: { THERMOGENIC: 0.75, ELECTROLYTIC: 0.75 },
    SOMATIC: {}
};

export function getMAPGPM(dist) {
    if (dist === 0) return 1.25;
    if (dist === 1) return 1.0;
    return 0.75;
}

export function getPPGain(dist) {
    if (dist === 0) return 3;
    if (dist === 1) return 2;
    return 1;
}

export function getDistance(nodeA, nodeB) {
    // 5 nodes, circular. 
    // Nodes: 0, 1, 2, 3, 4
    const diff = Math.abs(nodeA - nodeB);
    return Math.min(diff, 5 - diff);
}

export function calculateDamage(attacker, defender, move, dist) {
    const rawPower = move.power;
    const moveElement = move.element || attacker.type;
    const typeEffect = (ELEMENTAL_TABLE[moveElement] && ELEMENTAL_TABLE[moveElement][defender.type]) || 1.0;
    const critMult = Math.random() < (attacker.crit / 100) ? 1.5 : 1.0;
    const gpm = getMAPGPM(dist);
    const randomRoll = 0.85 + (Math.random() * 0.15);

    // Pokemon-inspired Ratio: ( (AttackerAtk / DefenderDef) * Power * 0.5 + 2 )
    let statRatio = attacker.atk / defender.def;

    // LEADER PERK #5: Ignore Defense
    const hasLeader5 = attacker.equippedCards && attacker.equippedCards.some(s => s.cardId === 'leader_5');
    if (hasLeader5) {
        console.log(`[PERK] Molecular Dissolver: Defense ignored! 🧪⚔️`);
        statRatio = attacker.atk / 1; // Effectively 1 Def
    }

    let baseDamage = ((statRatio * rawPower * 0.5) + 2) * typeEffect * critMult * gpm * randomRoll;

    // LEADER PERK #3: x2 First Hit Damage
    const hasLeader3 = attacker.equippedCards && attacker.equippedCards.some(s => s.cardId === 'leader_3');
    if (hasLeader3 && attacker.turnCount === 0) {
        console.log(`[PERK] Oxidative Energy Burst: First Hit double damage applied! ⚡⚡`);
        baseDamage *= 2;
    }

    console.log(`[DMG CALC] ${move.name} | Ratio: ${statRatio.toFixed(2)} | Type: x${typeEffect} | MAP: x${gpm} | Roll: x${randomRoll.toFixed(2)}`);

    // Shield Step: Pellicle reduction or Lysis Penalty
    let finalDamage;
    let shieldAbsorbed = 0;
    let lysisPenalty = 0;

    if (defender.pp >= 0) {
        // POSITIVE PP: Passive Mitigation (3 reduction per PP)
        shieldAbsorbed = Math.min(baseDamage - 1, defender.pp * 3);
        finalDamage = Math.max(1, baseDamage - (defender.pp * 3));
    } else {
        // NEGATIVE PP: Lysis State (3 extra damage per -PP)
        lysisPenalty = Math.abs(defender.pp) * 3;
        finalDamage = baseDamage + lysisPenalty;
        console.log(`[LYSIS] Broken Shield! Additional ${lysisPenalty} damage taken. 🧪🔴`);
    }

    return {
        damage: Math.round(finalDamage),
        shieldAbsorbed: Math.round(shieldAbsorbed),
        lysisPenalty: Math.round(lysisPenalty),
        isCrit: critMult > 1.0,
        isLysis: defender.pp < 0,
        typeMultiplier: typeEffect,
        gpm,
        randomRoll,
        usedLeader3: hasLeader3 && attacker.turnCount === 0,
        usedLeader5: hasLeader5
    };
}

export function resolveTurn(state) {
    const { player, enemy, currentTurn, playerLevel } = state;

    // LEADER PERK #4: Initiative Zero
    // This override should probably happen before resolveTurn is even called, 
    // but we can enforce it here by swapping turns if the condition is met.
    // However, resolveTurn is usually called after a turn is chosen.
    // We'll add logic in src/main.js for the core initiative.
    const actualDist = getDistance(player.currentNode, enemy.currentNode);

    // 1. Identify Attacker and Defender
    const attackerRef = currentTurn === 'PLAYER' ? player : enemy;
    const defenderRef = currentTurn === 'PLAYER' ? enemy : player;

    // Apply dynamic stats for both sides
    const attacker = (currentTurn === 'PLAYER')
        ? { ...attackerRef, ...getModifiedStats(attackerRef, state.playerLevel) }
        : { ...attackerRef, ...getModifiedStats(attackerRef, state.enemyLevel || 1) };

    const defender = (currentTurn === 'ENEMY')
        ? { ...defenderRef, ...getModifiedStats(defenderRef, state.playerLevel) }
        : { ...defenderRef, ...getModifiedStats(defenderRef, state.enemyLevel || 1) };

    // 2. Identify Moves
    const attackerMove = currentTurn === 'PLAYER'
        ? attacker.moves.find(m => m.id === player.selectedMove)
        : (enemy.moves.find(m => m.id === enemy.selectedMove) || enemy.moves[0]);

    // Defender Move Identification
    const defenderMove = currentTurn === 'PLAYER'
        ? (enemy.defenseMoves.find(m => m.id === enemy.selectedMove) || enemy.defenseMoves[0])
        : player.defenseMoves.find(m => m.id === player.selectedMove);

    // 3. Apply Tactical MAP Modifiers
    let effectiveDist = actualDist;

    // ATTACKER SIDE MODIFIERS (Original system)
    if (attackerMove.matchFixed !== undefined) {
        effectiveDist = attackerMove.matchFixed;
    } else if (attackerMove.matchRisky) {
        effectiveDist = (actualDist === 0) ? 0 : 2;
    } else if (attackerMove.matchOffset !== undefined) {
        effectiveDist = Math.max(0, Math.min(2, actualDist + attackerMove.matchOffset));
    }
    else if (attackerMove.matchExpand) {
        effectiveDist = Math.max(0, actualDist - attackerMove.matchExpand);
    }

    // DEFENDER SIDE MODIFIERS (New System)
    if (defenderMove && defenderMove.matchFixed !== undefined) {
        console.log(`[DEFENSE] ${defenderMove.name} overrides MAP result to: ${defenderMove.matchFixed}`);
        effectiveDist = defenderMove.matchFixed;
    }

    // 4. Calculate Damage (Using effective distance)
    const hitResult = calculateDamage(attacker, defender, attackerMove, effectiveDist);

    // 5. Apply Changes
    defender.hp = Math.max(0, defender.hp - hitResult.damage);

    // Healing Logic
    let attackerHeal = 0;
    if (attackerMove.heal) {
        attackerHeal = Math.round(attacker.maxHp * attackerMove.heal);
        attacker.hp = Math.min(attacker.maxHp, attacker.hp + attackerHeal);
    }

    let defenderHeal = 0;
    if (defenderMove && defenderMove.heal) {
        defenderHeal = Math.round(defender.maxHp * defenderMove.heal);
        defender.hp = Math.min(defender.maxHp, defender.hp + defenderHeal);
    }

    // Reflection Logic
    let reflectDamage = 0;
    if (defenderMove && defenderMove.reflect) {
        reflectDamage = Math.round(hitResult.damage * defenderMove.reflect);
        attacker.hp = Math.max(0, attacker.hp - reflectDamage);
    }

    // 6. Move Cost (Attacker - CAN GO NEGATIVE into Lysis)
    if (attackerMove.type === 'pellicle') {
        attacker.pp -= attackerMove.cost;
        // Clamp to minPP (maxPP * -1)
        attacker.pp = Math.max(attacker.pp, attacker.maxPp * -1);
    }

    // 7. Move Cost (Defender - CAN GO NEGATIVE into Lysis)
    if (defenderMove && defenderMove.type === 'pellicle') {
        defender.pp -= defenderMove.cost;
        // Clamp to minPP (maxPP * -1)
        defender.pp = Math.max(defender.pp, defender.maxPp * -1);
    }

    // 8. PP Generation (Basic Moves Only)
    let ppGain = 0;
    if (attackerMove.type === 'basic') {
        ppGain = getPPGain(effectiveDist);
        attacker.pp = Math.min(attacker.maxPp, attacker.pp + ppGain);
    }

    // 9. Turn Tracking
    attackerRef.turnCount++;

    // 10. Sync back to original persistent state
    attackerRef.hp = attacker.hp;
    attackerRef.pp = attacker.pp;
    attackerRef.maxHp = attacker.maxHp;
    attackerRef.maxPp = attacker.maxPp;

    defenderRef.hp = defender.hp;
    defenderRef.pp = defender.pp;
    defenderRef.maxHp = defender.maxHp;
    defenderRef.maxPp = defender.maxPp;

    return {
        actualDist,
        effectiveDist,
        hitResult,
        ppGain,
        reflectDamage,
        attackerHeal,
        defenderHeal,
        attacker: currentTurn,
        moveId: attackerMove.id,
        moveType: attackerMove.type,
        typeMultiplier: hitResult.typeMultiplier,
        isLysis: hitResult.isLysis,
        defenderMoveId: defenderMove ? defenderMove.id : 'quick_dodge',
        defenderMoveType: defenderMove ? defenderMove.type : 'basic'
    };
}

export function checkOverload(cell) {
    if (cell.pp >= cell.maxPp) {
        return 30; // Pellicle Discharge damage
    }
    return 0;
}

export function getModifiedStats(monster, playerLevel = 1) {
    const stats = {
        maxHp: monster.maxHp,
        atk: monster.atk,
        def: monster.def,
        spd: monster.spd,
        crit: monster.crit,
        pp: monster.pp,
        maxPp: monster.maxPp,
        slots: 3 // Base slots
    };

    if (monster.equippedCards) {
        monster.equippedCards.forEach(slot => {
            const card = CARDS[slot.cardId];
            if (!card) return;

            // Apply Stat Boosts
            if (card.stats.hp) stats.maxHp += card.stats.hp;
            if (card.stats.atk) stats.atk += card.stats.atk;
            if (card.stats.def) stats.def += card.stats.def;
            if (card.stats.spd) stats.spd += card.stats.spd;
            if (card.stats.crit) stats.crit += card.stats.crit;
            if (card.stats.pp) stats.maxPp += card.stats.pp;

            // Apply Slot Expansions
            stats.slots += card.slots;
        });
    }

    // Enforce Slot Limit
    stats.slots = Math.min(10, stats.slots);

    return stats;
}
