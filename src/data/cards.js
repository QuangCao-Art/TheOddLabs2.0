export const CARDS = {
    // TIER 1: Core Stats | Slot +0
    atk_5: { id: 'atk_5', name: 'Muscle Fiber Overdrive (+5)', tier: 1, stats: { atk: 5 }, slots: 0, rarity: 'common', desc: 'Lacing the tissue with high-tensile actin filaments for a minor punch.' },
    atk_10: { id: 'atk_10', name: 'Muscle Fiber Overdrive (+10)', tier: 1, stats: { atk: 10 }, slots: 0, rarity: 'uncommon', desc: 'Mid-grade actin reinforcement for consistent physical output.' },
    atk_20: { id: 'atk_20', name: 'Muscle Fiber Overdrive (+20)', tier: 1, stats: { atk: 20 }, slots: 0, rarity: 'uncommon', desc: 'High-tensile tissue lacing. Turns simple pokes into piercing strikes.' },
    atk_40: { id: 'atk_40', name: 'Muscle Fiber Overdrive: MAX (+40)', tier: 1, stats: { atk: 40 }, slots: 0, rarity: 'rare', desc: 'Ultimate actin-filament lacing. The monster is a living wrecking ball.' },

    def_5: { id: 'def_5', name: 'Dermal Hardening (+5)', tier: 1, stats: { def: 5 }, slots: 0, rarity: 'common', desc: 'Turning the skin into a bio-ceramic plate. Stiff but solid.' },
    def_10: { id: 'def_10', name: 'Dermal Hardening (+10)', tier: 1, stats: { def: 10 }, slots: 0, rarity: 'uncommon', desc: 'Thicker bio-ceramic layering for improved kinetic dampening.' },
    def_20: { id: 'def_20', name: 'Dermal Hardening (+20)', tier: 1, stats: { def: 20 }, slots: 0, rarity: 'uncommon', desc: 'Full-body bio-ceramic encasement. Minimal flexibility, maximum protection.' },
    def_40: { id: 'def_40', name: 'Dermal Hardening: MAX (+40)', tier: 1, stats: { def: 40 }, slots: 0, rarity: 'rare', desc: 'Impenetrable bio-ceramic shell. No flexibility, just absolute defense.' },

    hp_10: { id: 'hp_10', name: 'Vascular Expansion (+10)', tier: 1, stats: { hp: 10 }, slots: 0, rarity: 'common', desc: 'More cushion and better blood flow. Harder to put down.' },
    hp_20: { id: 'hp_20', name: 'Spare Cytoplasm (+20)', tier: 1, stats: { hp: 20 }, slots: 0, rarity: 'uncommon', desc: 'Extra "stuff" to keep the organs from rattling. Solid durability.' },
    hp_30: { id: 'hp_30', name: 'Vascular Expansion (+30)', tier: 1, stats: { hp: 30 }, slots: 0, rarity: 'uncommon', desc: 'Massive blood volume increase. The organism is deceptively bulky.' },
    hp_60: { id: 'hp_60', name: 'Vascular Expansion: MAX (+60)', tier: 1, stats: { hp: 60 }, slots: 0, rarity: 'rare', desc: 'The organism is basically one giant shock-absorbing vascular sac.' },

    spd_5: { id: 'spd_5', name: 'Synaptic Rewiring (+5)', tier: 1, stats: { spd: 5 }, slots: 0, rarity: 'common', desc: 'Coating nerves in conductive gel. Reactions start before the brain thinks.' },
    spd_10: { id: 'spd_10', name: 'Synaptic Rewiring (+10)', tier: 1, stats: { spd: 10 }, slots: 0, rarity: 'uncommon', desc: 'Highly conductive gel for faster reflex loops.' },
    spd_15: { id: 'spd_15', name: 'Conductive Slime Coating (+15)', tier: 1, stats: { spd: 15 }, slots: 0, rarity: 'uncommon', desc: 'Lubricating the synaptic pathways for faster movement.' },
    spd_20: { id: 'spd_20', name: 'Synaptic Rewiring: MAX (+20)', tier: 1, stats: { spd: 20 }, slots: 0, rarity: 'rare', desc: 'Nerves replaced with pure conductive filament. Instantaneous action.' },

    crit_1: { id: 'crit_1', name: 'Weak-Point Analysis (1%)', tier: 1, stats: { crit: 1 }, slots: 0, rarity: 'common', desc: 'Sensor-link detects microscopic cracks in enemy plating. Basic precision.' },
    crit_2: { id: 'crit_2', name: 'Weak-Point Analysis (2%)', tier: 1, stats: { crit: 2 }, slots: 0, rarity: 'uncommon', desc: 'Microscopic crack detection updated to V2.0. Aim for the gaps.' },
    crit_3: { id: 'crit_3', name: 'Weak-Point Analysis (3%)', tier: 1, stats: { crit: 3 }, slots: 0, rarity: 'uncommon', desc: 'Flawless knife-twisting protocol. Every hit finds the soft spots.' },
    crit_5: { id: 'crit_5', name: 'Weak-Point Analysis: MAX (5%)', tier: 1, stats: { crit: 5 }, slots: 0, rarity: 'rare', desc: 'Peak precision sensors. No crack goes undetected.' },

    pp_1: { id: 'pp_1', name: 'ATP Enrichment (1)', tier: 1, stats: { pp: 1 }, slots: 0, rarity: 'common', desc: 'Optimizing mitochondria for higher fuel density. Minor uptime boost.' },
    pp_2: { id: 'pp_2', name: 'ATP Enrichment (2)', tier: 1, stats: { pp: 2 }, slots: 0, rarity: 'uncommon', desc: 'Mitochondrial overclocking. High-energy skills are more sustainable.' },
    pp_3: { id: 'pp_3', name: 'ATP Enrichment (3)', tier: 1, stats: { pp: 3 }, slots: 0, rarity: 'uncommon', desc: 'Advanced ATP synthesis loops for consistent energy output.' },
    pp_5: { id: 'pp_5', name: 'ATP Enrichment: MAX (5)', tier: 1, stats: { pp: 5 }, slots: 0, rarity: 'rare', desc: 'Peak mitochondrial output. Extreme cellular energy storage.' },

    // TIER 2: Utility Expansion | Slot +1 (Matches Tier 2 Rules)
    atk_10_s1: { id: 'atk_10_s1', name: 'Muscle Fiber Override (+10) [S+1]', tier: 2, stats: { atk: 10 }, slots: 1, rarity: 'uncommon', desc: 'Reinforced lacing with integrated expansion nodes.' },
    def_10_s1: { id: 'def_10_s1', name: 'Dermal Plating (+10) [S+1]', tier: 2, stats: { def: 10 }, slots: 1, rarity: 'uncommon', desc: 'Bio-ceramic plates with additional equipment ports.' },
    spd_10_s1: { id: 'spd_10_s1', name: 'Conductive Nerve Gel (+10) [S+1]', tier: 2, stats: { spd: 10 }, slots: 1, rarity: 'uncommon', desc: 'Advanced gel lacing that also expands data processing capacity.' },
    hp_30_s1: { id: 'hp_30_s1', name: 'Organismal Cushion (+30) [S+1]', tier: 2, stats: { hp: 30 }, slots: 1, rarity: 'uncommon', desc: 'Distributing impact through liquid-filled vascular sacs.' },
    crit_2_s1: { id: 'crit_2_s1', name: 'Weak-Point Analysis (2%) [S+1]', tier: 2, stats: { crit: 2 }, slots: 1, rarity: 'uncommon', desc: 'Sensor-link precision with a dedicated tactical slot.' },
    pp_2_s1: { id: 'pp_2_s1', name: 'ATP Enrichment (2) [S+1]', tier: 2, stats: { pp: 2 }, slots: 1, rarity: 'uncommon', desc: 'Efficient energy packing with integrated expansion ports.' },

    // TIER 3: Advanced Optimization | Slot +2 (Matches Tier 3 Rules)
    atk_20_s2: { id: 'atk_20_s2', name: 'Carbon-Latice Claws (+20) [S+2]', tier: 3, stats: { atk: 20 }, slots: 2, rarity: 'rare', desc: 'Adding a carbon-latice finish to the claws. Piercing strikes guaranteed.' },
    def_20_s2: { id: 'def_20_s2', name: 'Bio-Ceramic Plating (+20) [S+2]', tier: 3, stats: { def: 20 }, slots: 2, rarity: 'rare', desc: 'Master-level dermal hardening with integrated sensor slots.' },
    hp_30_s2: { id: 'hp_30_s2', name: 'Vascular Expansion (+30) [S+2]', tier: 3, stats: { hp: 30 }, slots: 2, rarity: 'rare', desc: 'Maximized blood flow with dual expansion ports.' },
    spd_15_s2: { id: 'spd_15_s2', name: 'Synaptic Processor (+15) [S+2]', tier: 3, stats: { spd: 15 }, slots: 2, rarity: 'rare', desc: 'High-speed data processing units wired into the nervous system.' },
    crit_3_s2: { id: 'crit_3_s2', name: 'Weak-Point Analysis (3%) [S+2]', tier: 3, stats: { crit: 3 }, slots: 2, rarity: 'rare', desc: 'Peak analytical depth with dual tactical expansion.' },
    pp_3_s2: { id: 'pp_3_s2', name: 'ATP Enrichment (3) [S+2]', tier: 3, stats: { pp: 3 }, slots: 2, rarity: 'rare', desc: 'Ultimate mitochondrial fuel loops with maximum slot capacity.' },

    // LEADER CARDS
    leader_1: { id: 'leader_1', name: 'The Second Brain', tier: 'L', stats: {}, slots: 0, rarity: 'epic', isLeader: true, type: 'passive', desc: 'Unlocks the 1st Pellicle (2nd Move) skill slot.' },
    leader_2: { id: 'leader_2', name: 'The Third Brain', tier: 'L', stats: {}, slots: 0, rarity: 'epic', isLeader: true, type: 'passive', desc: 'Unlocks the 2nd Pellicle (3rd Move) skill slot.' },
    leader_3: { id: 'leader_3', name: 'Oxidative Energy Burst', tier: 'L', stats: {}, slots: 0, rarity: 'epic', isLeader: true, type: 'equip', desc: 'First hit of battle deals double damage.' },
    leader_4: { id: 'leader_4', name: 'Neural Initiative', tier: 'L', stats: {}, slots: 0, rarity: 'epic', isLeader: true, type: 'equip', desc: 'Active monster always acts first.' },
    leader_5: { id: 'leader_5', name: 'Molecular Dissolver', tier: 'L', stats: {}, slots: 0, rarity: 'epic', isLeader: true, type: 'equip', desc: 'Attacks ignore opponent Defense.' }
};

export const LEVEL_REWARDS = {
    1: ['atk_5', 'atk_5'],
    2: ['def_5', 'def_5'],
    3: ['spd_5', 'hp_10'],
    4: ['crit_2_s1', 'pp_1'],
    5: ['pp_2_s1', 'leader_1'],
    6: ['atk_10', 'atk_10', 'crit_1'],
    7: ['spd_10_s1', 'hp_20'],
    8: ['hp_30_s1', 'spd_15'],
    9: ['atk_20_s2', 'leader_2'],
    10: ['crit_3_s2'],
    11: ['atk_40', 'def_40', 'hp_60'],
    12: ['pp_3_s2'],
    13: ['def_20_s2'],
    14: ['crit_3_s2'],
    15: ['pp_3_s2', 'leader_3']
};

export const NPC_PRESETS = {
    opponent: {
        name: "Rival's Final Form",
        description: "The rival at their peak. Optimized for high-tier tactical balance.",
        owner: 'opponent',
        team: ['cambihil', 'lydrosome', 'nitrophil'],
        level: 15,
        squadSlots: {
            0: { // The Tank (Greedy depth-first)
                0: 'atk_20_s2', 1: 'hp_60', 2: 'hp_30_s1', 3: 'def_20_s2', 4: 'def_40',
                5: 'pp_3_s2', 6: 'atk_40', 7: 'pp_3_s2', 8: 'crit_3_s2', 9: 'crit_3_s2'
            },
            1: { // Support
                0: 'spd_10_s1', 1: 'hp_20', 2: 'spd_15', 3: 'pp_2_s1', 4: 'crit_2_s1'
            },
            2: { // Reserve
                0: 'atk_10', 1: 'atk_10', 2: 'hp_10'
            }
        }
    },
    jenzi_rg15: {
        name: "Jenzi's Final Form",
        description: "The Senior's true tactical depth. Optimized for all three disciplines.",
        owner: 'jenzi',
        team: ['cambihil', 'lydrosome', 'nitrophil'],
        level: 15,
        squadSlots: {
            0: { // Striker (Greedy depth-first)
                0: 'atk_20_s2', 1: 'hp_60', 2: 'hp_30_s1', 3: 'def_20_s2', 4: 'def_40',
                5: 'pp_3_s2', 6: 'atk_40', 7: 'pp_3_s2', 8: 'crit_3_s2', 9: 'crit_3_s2'
            },
            1: { // Balanced
                0: 'spd_10_s1', 1: 'hp_20', 2: 'spd_15', 3: 'pp_2_s1', 4: 'crit_2_s1'
            },
            2: { // Reserve
                0: 'atk_10', 1: 'atk_10', 2: 'hp_10'
            }
        }
    },
    lana: {
        name: "Lana's Fortress",
        description: "Botanical defense focused on maximum survival and bio-ceramic integrity.",
        owner: 'lana',
        team: ['cambihil'],
        level: 5,
        squadSlots: {
            0: { // Survival (Greedy depth-first)
                0: 'pp_2_s1', 1: 'def_5', 2: 'def_5', 3: 'crit_2_s1', 4: 'hp_10'
            }
        }
    },
    dyzes: {
        name: "Dyzes' Protocol",
        description: "Osmotic snipers focused on synaptic speed and Pellicle point generation.",
        owner: 'dyzes',
        team: ['lydrosome', 'lydrosome'],
        level: 9,
        squadSlots: {
            0: { // Utility (Greedy depth-first)
                0: 'atk_20_s2', 1: 'hp_10', 2: 'atk_10', 3: 'hp_30_s1', 4: 'hp_20',
                5: 'spd_10_s1', 6: 'pp_2_s1', 7: 'crit_2_s1', 8: 'spd_15'
            },
            1: { // Backup
                0: 'atk_10', 1: 'def_5', 2: 'def_5'
            }
        }
    },
    capsain: {
        name: "Director's Order",
        description: "Absolute authority with a focus on overwhelming physical force and critical breaches.",
        owner: 'capsain',
        team: ['nitrophil', 'nitrophil', 'nitrophil'],
        level: 13,
        squadSlots: {
            0: { // The Heavy (Greedy depth-first)
                0: 'atk_20_s2', 1: 'hp_20', 2: 'atk_10', 3: 'def_20_s2', 4: 'spd_15',
                5: 'crit_3_s2', 6: 'hp_60', 7: 'pp_3_s2', 8: 'def_40', 9: 'atk_40'
            },
            1: { // Tactical backup
                0: 'hp_30_s1', 1: 'hp_10', 2: 'spd_5', 3: 'spd_10_s1', 4: 'pp_2_s1', 5: 'crit_2_s1', 6: 'atk_10'
            },
            2: { // Maintenance
                0: 'def_5', 1: 'def_5', 2: 'atk_5'
            }
        }
    },
    npc01: {
        name: "Balanced Readiness",
        description: "Standard tactical spread for early-grade clearance.",
        team: ['lydrosome', 'lydrosome'],
        level: 2,
        squadSlots: {
            0: { 0: 'atk_5', 1: 'def_5' },
            1: { 0: 'atk_5', 1: 'def_5' }
        }
    },
    npc02: {
        name: "Sturdy Bio-Signature",
        description: "High early-grade defense and survival protocols.",
        team: ['nitrophil', 'nitrophil'],
        level: 6,
        squadSlots: {
            0: { // Survival/Utility
                0: 'pp_2_s1', 1: 'def_5', 2: 'def_5', 3: 'crit_2_s1', 4: 'hp_10'
            },
            1: {
                0: 'atk_10', 1: 'atk_10', 2: 'spd_5'
            }
        }
    },
    npc03: {
        name: "Aggressive Probe",
        description: "Focus on early critical openings and speed.",
        team: ['cambihil', 'cambihil'],
        level: 10,
        squadSlots: {
            0: { // Aggressive Lead
                0: 'atk_20_s2', 1: 'spd_15', 2: 'hp_20', 3: 'crit_3_s2', 4: 'atk_10',
                5: 'hp_30_s1', 6: 'spd_10_s1', 7: 'atk_10'
            },
            1: { // Backup
                0: 'crit_2_s1', 1: 'hp_10', 2: 'spd_5', 3: 'pp_2_s1'
            }
        }
    }
};
