/**
 * AI Decision Engine for The Odd Labs 2.0
 * Handles tactical move selection and node prediction for enemy Cells.
 */

export const AI = {
    /**
     * Selects the best move for the enemy based on current HP/PP status.
     * @param {Object} enemy - The enemy monster state.
     * @param {boolean} isAttacking - Whether it's the enemy's attack turn.
     * @returns {Object} - The selected move object.
     */
    selectMove(enemy, isAttacking) {
        const moveset = isAttacking ? enemy.moves : enemy.defenseMoves;
        const availablePP = enemy.pp;
        const hpPercent = (enemy.hp / enemy.maxHp) * 100;

        // 1. DEFENSE LOGIC
        if (!isAttacking) {
            // Priority 1: Survival
            if (hpPercent < 40) {
                const magmaChitin = moveset.find(m => m.id === 'magma_chitin');
                if (magmaChitin && availablePP >= magmaChitin.cost) return magmaChitin;
            }

            // Priority 2: Tactical Mitigation
            if (availablePP >= 2) {
                const thermoShell = moveset.find(m => m.id === 'thermo_shell');
                if (thermoShell && availablePP >= thermoShell.cost) return thermoShell;
            }

            // Fallback: Quick Dodge
            return moveset.find(m => m.id === 'quick_dodge') || moveset[0];
        }

        // 2. ATTACK LOGIC
        // Priority 1: Prevent Overload Recall (Spend PP if near 10)
        if (availablePP >= 8) {
            const expensiveMoves = moveset.filter(m => m.type === 'pellicle' && m.cost > 0)
                .sort((a, b) => b.cost - a.cost);
            if (expensiveMoves.length > 0 && availablePP >= expensiveMoves[0].cost) {
                return expensiveMoves[0];
            }
        }

        // Priority 2: Weighted Random for affordable Pellicle skills
        const affordablePellicle = moveset.filter(m => m.type === 'pellicle' && availablePP >= m.cost);
        if (affordablePellicle.length > 0 && Math.random() < 0.6) {
            return affordablePellicle[Math.floor(Math.random() * affordablePellicle.length)];
        }

        // Fallback: Basic Strike
        return moveset.find(m => m.type === 'basic') || moveset[0];
    },

    /**
     * Predicts the player's next move or chooses a tactical node.
     * Currently uses a weighted random biased toward player's recent choices.
     * @param {Object} enemy - Enemy state.
     * @param {Object} player - Player state.
     * @returns {number} - The selected node (0-4).
     */
    selectNode(enemy, player) {
        // Simple but "smarter" than pure random:
        // Try to stay near or match the player's current node (predicting they won't move far)
        if (Math.random() < 0.4) {
            const offset = (Math.random() < 0.5) ? -1 : 1;
            return (player.currentNode + offset + 5) % 5;
        }

        // Sometimes match exactly
        if (Math.random() < 0.2) return player.currentNode;

        // Otherwise pure random
        return Math.floor(Math.random() * 5);
    }
};
