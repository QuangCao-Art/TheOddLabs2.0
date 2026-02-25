export const CARDS = {
    // TIER 1: Stats Only | Slot +0
    atk_5: { id: 'atk_5', name: 'ATK Adaptor +5', tier: 1, stats: { atk: 5 }, slots: 0, rarity: 'common' },
    def_5: { id: 'def_5', name: 'DEF Buffer +5', tier: 1, stats: { def: 5 }, slots: 0, rarity: 'common' },
    spd_5: { id: 'spd_5', name: 'SPD Accelerator +5', tier: 1, stats: { spd: 5 }, slots: 0, rarity: 'common' },
    hp_10: { id: 'hp_10', name: 'HP Vitalizer +10', tier: 1, stats: { hp: 10 }, slots: 0, rarity: 'common' },
    atk_10: { id: 'atk_10', name: 'ATK Adaptor +10', tier: 1, stats: { atk: 10 }, slots: 0, rarity: 'uncommon' },
    def_10: { id: 'def_10', name: 'DEF Buffer +10', tier: 1, stats: { def: 10 }, slots: 0, rarity: 'uncommon' },
    spd_10: { id: 'spd_10', name: 'SPD Accelerator +10', tier: 1, stats: { spd: 10 }, slots: 0, rarity: 'uncommon' },
    hp_30: { id: 'hp_30', name: 'HP Vitalizer +30', tier: 1, stats: { hp: 30 }, slots: 0, rarity: 'uncommon' },
    atk_20: { id: 'atk_20', name: 'ATK Adaptor +20', tier: 1, stats: { atk: 20 }, slots: 0, rarity: 'rare' },
    def_20: { id: 'def_20', name: 'DEF Buffer +20', tier: 1, stats: { def: 20 }, slots: 0, rarity: 'rare' },

    // TIER 2: Stats + Slot +1
    crit_1_s1: { id: 'crit_1_s1', name: 'CRIT Scan +1% [S+1]', tier: 2, stats: { crit: 1 }, slots: 1, rarity: 'uncommon' },
    pp_1_s1: { id: 'pp_1_s1', name: 'PP Capacitor +1 [S+1]', tier: 2, stats: { pp: 1 }, slots: 1, rarity: 'uncommon' },
    spd_10_s1: { id: 'spd_10_s1', name: 'SPD Turbo +10 [S+1]', tier: 2, stats: { spd: 10 }, slots: 1, rarity: 'uncommon' },
    hp_30_s1: { id: 'hp_30_s1', name: 'HP Bulk +30 [S+1]', tier: 2, stats: { hp: 30 }, slots: 1, rarity: 'uncommon' },

    // TIER 3: Stats + Slot +2
    atk_20_s2: { id: 'atk_20_s2', name: 'ATK Core +20 [S+2]', tier: 3, stats: { atk: 20 }, slots: 2, rarity: 'rare' },
    crit_2_s2: { id: 'crit_2_s2', name: 'CRIT Lens +2% [S+2]', tier: 3, stats: { crit: 2 }, slots: 2, rarity: 'rare' },
    pp_2_s2: { id: 'pp_2_s2', name: 'PP Reactor +2 [S+2]', tier: 3, stats: { pp: 2 }, slots: 2, rarity: 'rare' },
    def_20_s2: { id: 'def_20_s2', name: 'DEF Bastion +20 [S+2]', tier: 3, stats: { def: 20 }, slots: 2, rarity: 'rare' },
    crit_3_s2: { id: 'crit_3_s2', name: 'CRIT Sniper +3% [S+2]', tier: 3, stats: { crit: 3 }, slots: 2, rarity: 'rare' },
    pp_3_s2: { id: 'pp_3_s2', name: 'PP Singularity +3 [S+2]', tier: 3, stats: { pp: 3 }, slots: 2, rarity: 'legendary' }
};

export const LEVEL_REWARDS = {
    1: ['atk_5', 'atk_5', 'atk_5'],
    2: ['def_5', 'def_5', 'def_5'],
    3: ['spd_5', 'hp_10', 'atk_5'],
    4: ['crit_1_s1', 'atk_5', 'def_5'],
    5: ['pp_1_s1', 'hp_10', 'spd_5'], // Leader #1: 2nd Core
    6: ['atk_10', 'atk_10', 'def_10'],
    7: ['spd_10_s1', 'atk_10', 'hp_10'],
    8: ['hp_30_s1', 'def_10', 'spd_10'],
    9: ['atk_20_s2', 'atk_10', 'crit_1_s1'],
    10: ['crit_2_s2', 'hp_30', 'def_10'], // Leader #2: 3rd Core
    11: ['atk_10', 'def_10', 'spd_10'],
    12: ['pp_2_s2', 'atk_20', 'hp_30'],
    13: ['def_20_s2', 'spd_10', 'crit_1_s1'],
    14: ['crit_3_s2', 'atk_20', 'def_20'],
    15: ['pp_3_s2', 'hp_30', 'crit_2_s2'] // Leader #3: x2 Burst
};
