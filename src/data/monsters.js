export const MONSTERS = {
    nitrophil: {
        id: 'nitrophil',
        name: 'Nitrophil',
        type: 'THERMOGENIC',
        archetype: 'LYTIC',
        lore: 'A mutated neutrophil immune cell with explosive properties. It maybe has too much fun throwing its burst pods everywhere.',
        hp: 100,
        maxHp: 100,
        pp: 1,
        maxPp: 10,
        atk: 15,
        def: 10,
        spd: 12,
        crit: 5,
        moves: [
            { id: 'membrane_pierce', name: 'Membrane Pierce', type: 'basic', element: 'SOMATIC', power: 40, cost: 0, desc: 'A sharp enzymatic strike that pierces enemy defenses. Reliable and cost-free.' },
            { id: 'oxidative_purge', name: 'Oxidative Purge', type: 'pellicle', element: 'THERMOGENIC', power: 55, cost: 3, desc: 'Floods the target with reactive oxygen. A mid-power tactical choice.' },
            { id: 'nitric_burst', name: 'Nitric Burst', type: 'pellicle', element: 'THERMOGENIC', power: 60, cost: 6, matchOffset: -1, desc: 'A high-output explosive burst. [EASY TARGET]: The blast area is so wide that landing on an ADJACENT node still counts as a perfect MATCH (1.25x DMG).' }
        ],
        defenseMoves: [
            { id: 'thermo_dodge', name: 'Thermo Dodge', type: 'basic', element: 'THERMOGENIC', cost: 0, desc: 'A thermal-assisted defensive maneuver.' },
            { id: 'thermo_shell', name: 'Thermo Shell', type: 'pellicle', element: 'THERMOGENIC', cost: 2, matchFixed: 1, reflect: 0.2, desc: 'Surrounds the cell in a heat-active buffer. [RELIABLE HIT]: Forces a NEAR result on enemy attacks and reflects 20% damage.' },
            { id: 'magma_chitin', name: 'Magma Chitin', type: 'pellicle', element: 'THERMOGENIC', cost: 4, matchFixed: 2, reflect: 0.2, desc: 'Hardens the membrane into a volcanic mineral plate. [PUNY SLAP]: Forces a FAR result on enemy attacks and reflects 20% damage.' }
        ]
    },
    cambihil: {
        id: 'cambihil',
        name: 'Cambihil',
        type: 'BOTANIC',
        archetype: 'SOMATIC',
        lore: 'A resilient entity derived from specialized plant cambium tissue. Its dense cellulose shielding and rapid regenerative capacity make it a formidable tank in the cellular arena.',
        hp: 110,
        maxHp: 110,
        pp: 1,
        maxPp: 11,
        atk: 12,
        def: 13,
        spd: 10,
        crit: 4,
        moves: [
            { id: 'chloro_strike', name: 'Chloro-Strike', type: 'basic', element: 'SOMATIC', power: 45, cost: 0, desc: 'A standard botanical strike. Fast and enzymatic.' },
            { id: 'cambium_root', name: 'Cambium Root', type: 'pellicle', element: 'BOTANIC', power: 50, cost: 3, heal: 0.1, desc: 'Siphons life force from the target to repair physical damage. [HEAL]: Restores 10% HP.' },
            { id: 'overgrowth', name: 'Overgrowth', type: 'pellicle', element: 'BOTANIC', power: 70, cost: 4, matchExpand: 1, desc: 'Entangling vines erupt from the cell membrane. [EASY TARGET]: The area of effect is so large that any result better than FAR counts as a perfect MATCH (1.25x DMG).' }
        ],
        defenseMoves: [
            { id: 'bota_dodge', name: 'Bota Dodge', type: 'basic', element: 'BOTANIC', cost: 0, desc: 'A plant-inspired defensive maneuver.' },
            { id: 'cellulose_wall', name: 'Cellulose Wall', type: 'pellicle', element: 'BOTANIC', cost: 3, matchFixed: 1, heal: 0.15, desc: 'Hardens the membrane into a rigid regenerative plate. [RELIABLE HIT]: Forces a NEAR result and [HEAL]: restored 15% HP.' },
            { id: 'phloem_snare', name: 'Phloem Snare', type: 'pellicle', element: 'BOTANIC', cost: 4, matchFixed: 1, hasHurtBlock: true, desc: 'A sticky sap trap that entangles both combatants. [RELIABLE HIT]: Forces a NEAR result, triggering a positional lock [HURTBLOCK] that disables both current nodes for the next turn.' }
        ]
    },
    lydrosome: {
        id: 'lydrosome',
        name: 'Lydrosome',
        type: 'OSMOTIC',
        archetype: 'TACTICIAN',
        lore: 'A high-enzyme lysosome modified for long-range secretion. It uses chemical lances to dissolve enemy membranes from a safe tactical distance.',
        hp: 95,
        maxHp: 95,
        pp: 1,
        maxPp: 9,
        atk: 17,
        def: 8,
        spd: 14,
        crit: 6,
        moves: [
            { id: 'enzyme_lance', name: 'Enzyme Lance', type: 'basic', element: 'SOMATIC', power: 40, cost: 0, desc: 'A concentrated enzymatic jet. Pierces defenses with surgical precision.' },
            { id: 'osmotic_surge', name: 'Osmotic Surge', type: 'pellicle', element: 'OSMOTIC', power: 65, cost: 4, hasChoiceBlock: true, desc: 'A sudden surge of osmotic pressure. [CHOICEBLOCK]: Locks your movement options for the next turn.' },
            { id: 'hydro_shot', name: 'Hydro Shot', type: 'pellicle', element: 'OSMOTIC', power: 85, cost: 6, matchRisky: true, desc: 'A high-pressure osmotic blast. [ALL OR NOTHING]: Devastating damage if distance is 0 (MATCH), but accuracy falls off sharply at range.' }
        ],
        defenseMoves: [
            { id: 'osmo_dodge', name: 'Osmo Dodge', type: 'basic', element: 'OSMOTIC', cost: 0, desc: 'An osmosis-based defensive maneuver.' },
            { id: 'ion_veil', name: 'Ion Veil', type: 'pellicle', element: 'OSMOTIC', cost: 2, matchFixed: 2, desc: 'Surrounds the cell in a repulsive ionic field. [PUNY SLAP]: Forces a FAR result to maximize distance between you and the predator.' },
            { id: 'osmotic_snare', name: 'Osmotic Snare', type: 'pellicle', element: 'OSMOTIC', cost: 4, hasHurtBlock: true, desc: 'A field of suspended particles. [HURTBLOCK]: disables nodes for both players.' }
        ]
    }
};
