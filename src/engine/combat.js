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
    const statRatio = attacker.atk / defender.def;
    const baseDamage = ((statRatio * rawPower * 0.5) + 2) * typeEffect * critMult * gpm * randomRoll;

    console.log(`[DMG CALC] ${move.name} | Ratio: ${statRatio.toFixed(2)} | Type: x${typeEffect} | MAP: x${gpm} | Roll: x${randomRoll.toFixed(2)}`);

    // Shield Step: Pellicle reduction
    const shieldAbsorbed = Math.min(baseDamage - 1, defender.pp * 3);
    const finalDamage = Math.max(1, baseDamage - (defender.pp * 3));

    return {
        damage: Math.round(finalDamage),
        shieldAbsorbed: Math.round(shieldAbsorbed),
        isCrit: critMult > 1.0,
        typeMultiplier: typeEffect,
        gpm,
        randomRoll
    };
}

export function resolveTurn(state) {
    const { player, enemy, currentTurn } = state;
    const actualDist = getDistance(player.currentNode, enemy.currentNode);

    // 1. Identify Attacker and Defender
    const attacker = currentTurn === 'PLAYER' ? player : enemy;
    const defender = currentTurn === 'PLAYER' ? enemy : player;

    // 2. Identify Moves
    const attackerMove = currentTurn === 'PLAYER'
        ? player.moves.find(m => m.id === player.selectedMove)
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
    // Defense skills like Flame Guard force a specific result on the attacker
    if (defenderMove && defenderMove.matchFixed !== undefined) {
        console.log(`[DEFENSE] ${defenderMove.name} overrides MAP result to: ${defenderMove.matchFixed}`);
        effectiveDist = defenderMove.matchFixed;
    }

    // 4. Calculate Damage (Using effective distance)
    const hitResult = calculateDamage(attacker, defender, attackerMove, effectiveDist);

    // 5. Apply Changes
    defender.hp = Math.max(0, defender.hp - hitResult.damage);

    // Healing Logic (New System)
    let attackerHeal = 0;
    if (attackerMove.heal) {
        attackerHeal = Math.round(attacker.maxHp * attackerMove.heal);
        attacker.hp = Math.min(attacker.maxHp, attacker.hp + attackerHeal);
        console.log(`[HEAL] ${attacker.name} restored ${attackerHeal} HP.`);
    }

    let defenderHeal = 0;
    if (defenderMove && defenderMove.heal) {
        defenderHeal = Math.round(defender.maxHp * defenderMove.heal);
        defender.hp = Math.min(defender.maxHp, defender.hp + defenderHeal);
        console.log(`[HEAL] ${defender.name} restored ${defenderHeal} HP.`);
    }

    // Reflection Logic (New System)
    let reflectDamage = 0;
    if (defenderMove && defenderMove.reflect) {
        reflectDamage = Math.round(hitResult.damage * defenderMove.reflect);
        attacker.hp = Math.max(0, attacker.hp - reflectDamage);
        console.log(`[REFLECT] ${defenderMove.name} returned ${reflectDamage} damage to attacker.`);
    }

    // 6. Move Cost (Attacker - Pay First)
    if (attackerMove.type === 'pellicle') attacker.pp -= attackerMove.cost;

    // 7. Move Cost (Defender - New System)
    if (defenderMove && defenderMove.type === 'pellicle') defender.pp -= defenderMove.cost;

    // 8. PP Generation (Reward Second - Prevents overflow cap wasting reward)
    const ppGain = getPPGain(effectiveDist);
    attacker.pp = Math.min(attacker.maxPp, attacker.pp + ppGain);

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
