/**
 * AI Decision Engine for The Odd Labs 2.0
 * Handles tactical move selection and node prediction for enemy Cells.
 */

export const AI = {
    /**
     * Selects the best move for the enemy based on fuzzy logic and "Neural Noise".
     */
    selectMove(enemy, isAttacking, player = null) {
        const moveset = isAttacking ? enemy.moves : enemy.defenseMoves;
        const hpPercent = (enemy.hp / enemy.maxHp) * 100;
        const isLysis = enemy.pp < 0;
        const minPp = enemy.maxPp * -1;

        // NEURAL NOISE: 15% chance to ignore optimal strategy and pick a random affordable move
        if (Math.random() < 0.15) {
            const affordable = moveset.filter(m => m.type !== 'pellicle' || enemy.pp > minPp);
            return affordable[Math.floor(Math.random() * affordable.length)] || moveset[0];
        }

        // 1. DEFENSE LOGIC (Defense Phase)
        if (!isAttacking) {
            // Priority: Survival (Fuzzy check)
            // Smarter Debt Check: Avoid spending if in Lysis unless critically low on HP
            const canAffordDefense = !isLysis || hpPercent < 25;

            if (hpPercent < 45 && canAffordDefense && enemy.pp >= 4 && Math.random() < 0.8) {
                const magmaChitin = moveset.find(m => m.id === 'magma_chitin');
                if (magmaChitin) return magmaChitin;
            }

            // Tactical Mitigation
            if (canAffordDefense && enemy.pp >= 2 && Math.random() < 0.6) {
                const thermoShell = moveset.find(m => m.id === 'thermo_shell');
                if (thermoShell) return thermoShell;
            }

            return moveset.find(m => m.id === 'quick_dodge') || moveset[0];
        }

        // 2. ATTACK LOGIC (Attack Phase)
        // Critical Spend: High chance to use expensive skills if at risk of Overload (PP >= 8)
        if (enemy.pp >= 8 && Math.random() < 0.9) {
            const highCost = moveset.filter(m => m.type === 'pellicle' && m.cost > 0)
                .sort((a, b) => b.cost - a.cost);
            if (highCost.length > 0) return highCost[0];
        }

        // Calculated Aggression: Weighted chance for Pellicle skills
        const affordablePellicle = moveset.filter(m => m.type === 'pellicle' && enemy.pp > minPp);

        // DEBT AWARENESS: Drastically reduce aggro if in Lysis
        let pChance = hpPercent > 70 ? 0.7 : 0.4;
        if (isLysis) pChance = 0.15; // Only 15% chance to over-exert

        // FINAL GAMBIT: If player is low on health, become MUCH more aggressive even in Lysis
        if (player && (player.hp / player.maxHp) < 0.25) {
            console.log("[AI] FINAL GAMBIT! Risking Lysis for the kill. 🛡️⚡");
            pChance = 0.85;
        }

        if (affordablePellicle.length > 0 && Math.random() < pChance) {
            return affordablePellicle[Math.floor(Math.random() * affordablePellicle.length)];
        }

        return moveset.find(m => m.type === 'basic') || moveset[0];
    },

    /**
     * Chooses a tactical node using prediction algorithms and Bluff logic.
     */
    selectNode(enemy, player) {
        const roll = Math.random();
        let targetNode = -1;

        // 1. BLUFF PATTERN: 25% chance to pick a node completely opposite to the player
        if (roll < 0.25) {
            const farNodes = [2, 3].map(offset => (player.currentNode + offset) % 5);
            targetNode = farNodes[Math.floor(Math.random() * farNodes.length)];
        }
        // 2. PREDICTION: 40% chance to guess player's displacement
        else if (roll < 0.65) {
            const drift = (Math.random() < 0.5) ? -1 : 1;
            targetNode = (player.currentNode + drift + 5) % 5;
        }
        // 3. AGGRESSIVE MATCH: 20% chance to chase the player's exact position
        else if (roll < 0.85) {
            targetNode = player.currentNode;
        }
        // 4. THE JOKER: Pure random result
        else {
            targetNode = Math.floor(Math.random() * 5);
        }

        // ChoiceBlock & HurtBlock Enforcement: Avoid all blocked nodes
        if (enemy.blockedNodes.some(b => b.index === targetNode)) {
            // Pick a random node that ISN'T in the blocked list
            const available = [0, 1, 2, 3, 4].filter(n => !enemy.blockedNodes.some(b => b.index === n));
            if (available.length > 0) {
                targetNode = available[Math.floor(Math.random() * available.length)];
            }
        }

        return targetNode;
    }
};
