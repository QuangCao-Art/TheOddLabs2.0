export const SYNTHESIS_RECIPES = [
    {
        id: 'stemmy',
        name: 'STEMMY',
        description: 'The foundational biological unit. Resilient and adaptable.',
        requirements: [
            { id: 'biomass', name: 'BIOMASS', amount: 90, type: 'resource' },
            { id: 'blueprint_stemmy', name: 'STEMMY BLUEPRINT', amount: 1, type: 'item' }
        ],
        iconClass: 'icon-stemmy'
    },
    {
        id: 'nitrophil',
        name: 'NITROPHIL',
        description: 'Modified defensive unit with explosive enzymatic properties.',
        requirements: [
            { id: 'biomass', name: 'BIOMASS', amount: 150, type: 'resource' },
            { id: 'blueprint_nitrophil', name: 'NITROPHIL BLUEPRINT', amount: 1, type: 'item' },
            { id: 'blueprint_stemmy', name: 'STEMMY BLUEPRINT', amount: 1, type: 'item' }
        ],
        iconClass: 'icon-nitrophil'
    },
    {
        id: 'cambihil',
        name: 'CAMBIHIL',
        description: 'Botanical-derived entity with high regenerative capacity.',
        requirements: [
            { id: 'biomass', name: 'BIOMASS', amount: 150, type: 'resource' },
            { id: 'blueprint_cambihil', name: 'CAMBIHIL BLUEPRINT', amount: 1, type: 'item' },
            { id: 'blueprint_stemmy', name: 'STEMMY BLUEPRINT', amount: 1, type: 'item' }
        ],
        iconClass: 'icon-cambihil'
    },
    {
        id: 'lydrosome',
        name: 'LYDROSOME',
        description: 'Tactical unit designed for long-range enzymatic projection.',
        requirements: [
            { id: 'biomass', name: 'BIOMASS', amount: 150, type: 'resource' },
            { id: 'blueprint_lydrosome', name: 'LYDROSOME BLUEPRINT', amount: 1, type: 'item' },
            { id: 'blueprint_stemmy', name: 'STEMMY BLUEPRINT', amount: 1, type: 'item' }
        ],
        iconClass: 'icon-lydrosome'
    }
];
