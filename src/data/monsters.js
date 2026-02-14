export const MONSTERS = {
    nitrophil: {
        id: 'nitrophil',
        name: 'Nitrophil',
        type: 'THERMOGENIC',
        archetype: 'LYTIC',
        lore: 'A mutated neutrophil immune cell with explosive properties. It seeks out pathogens and triggers a self-destruct sequence to sanitize the cellular matrix.',
        hp: 100,
        maxHp: 100,
        pp: 1,
        maxPp: 10,
        atk: 14,
        def: 10,
        crit: 10,
        moves: [
            { id: 'membrane_pierce', name: 'Membrane Pierce', type: 'basic', power: 40, cost: 0, desc: 'A sharp enzymatic strike that pierces enemy defenses. Reliable and cost-free.' },
            { id: 'oxidative_purge', name: 'Oxidative Purge', type: 'pellicle', power: 55, cost: 3, desc: 'Floods the target with reactive oxygen. A mid-power tactical choice.' },
            { id: 'nitric_burst', name: 'Nitric Burst', type: 'pellicle', power: 60, cost: 6, matchOffset: -1, desc: 'A high-output explosive burst. [EASY TARGET]: The blast area is so wide that landing on an ADJACENT node still counts as a perfect MATCH (1.25x DMG).' }
        ],
        defenseMoves: [
            { id: 'quick_dodge', name: 'Quick Dodge', type: 'basic', cost: 0, desc: 'A standard defensive maneuver. Rely on tactical positioning to minimize damage.' },
            { id: 'thermo_shell', name: 'Thermo Shell', type: 'pellicle', cost: 2, matchFixed: 1, reflect: 0.2, desc: 'Surrounds the cell in a heat-active buffer. Forces a [NEAR] result on enemy attacks and reflects 20% damage.' },
            { id: 'magma_chitin', name: 'Magma Chitin', type: 'pellicle', cost: 4, matchFixed: 2, reflect: 0.2, desc: 'Hardens the membrane into a volcanic mineral plate. Forces a [FAR] result on enemy attacks and reflects 20% damage.' }
        ]
    },
    cambihil: {
        id: 'cambihil',
        name: 'Cambihil',
        type: 'BOTANIC',
        archetype: 'SOMATIC',
        lore: 'Derived from specialized plant cambium tissue. Known for its rapid cellular division and dense cellulose shielding, it acts as a resilient anchor in any formation.',
        hp: 120,
        maxHp: 120,
        pp: 1,
        maxPp: 12,
        atk: 10,
        def: 15,
        crit: 5,
        moves: [
            { id: 'chlorophyll_strike', name: 'Chloro-Strike', type: 'basic', power: 40, cost: 0 },
            { id: 'overgrowth', name: 'Overgrowth', type: 'pellicle', power: 65, cost: 4 }
        ],
        defenseMoves: [
            { id: 'quick_dodge', name: 'Quick Dodge', type: 'basic', cost: 0, desc: 'A standard defensive maneuver.' }
        ]
    },
    lydrosome: {
        id: 'lydrosome',
        name: 'Lydrosome',
        type: 'OSMOTIC',
        archetype: 'TACTICIAN',
        lore: 'A high-enzyme lysosome modified for long-range secretion. It uses chemical lances to dissolve enemy membranes from a safe tactical distance.',
        hp: 85,
        maxHp: 85,
        pp: 1,
        maxPp: 10,
        atk: 18,
        def: 8,
        crit: 20,
        moves: [
            { id: 'enzyme_lance', name: 'Enzyme Lance', type: 'basic', power: 40, cost: 0 },
            { id: 'hydro_shot', name: 'Hydro Shot', type: 'pellicle', power: 80, cost: 6 }
        ],
        defenseMoves: [
            { id: 'quick_dodge', name: 'Quick Dodge', type: 'basic', cost: 0, desc: 'A standard defensive maneuver.' }
        ]
    }
};
