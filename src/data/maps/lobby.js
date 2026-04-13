export const lobby = {
    name: 'LAB LOBBY',
    width: 11,
    height: 8,
    spawn: { x: 5, y: 6 },
    layout: [
        [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
        [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11],
        [10, 32, 15, 15, 15, 22, 15, 15, 15, 32, 11],
        [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
        [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
        [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
        [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
        [2, 9, 9, 9, 9, 29, 9, 9, 9, 9, 3]
    ],
    objects: [
        { id: 'f38_lob', x: 2, y: 2, type: 'prop', name: 'Incubation Chamber' },
        { id: 'f39_lob', x: 3, y: 2, type: 'prop', name: 'Incubation Chamber' },
        { id: 'f40_lob', x: 2, y: 3, type: 'prop', name: 'Incubation Chamber' },
        { id: 'f41_lob', x: 3, y: 3, type: 'prop', name: 'Incubation Chamber' },
        { id: 'f15_lob_n1', x: 7, y: 2, type: 'prop', name: 'Blue Specimen Tank' },
        { id: 'f16_lob_n1', x: 7, y: 3, type: 'prop', name: 'Blue Specimen Tank' },
        { id: 'f22_lob_n2', x: 8, y: 2, type: 'prop', name: 'Red Specimen Tank' },
        { id: 'f23_lob_br', x: 8, y: 3, type: 'prop', name: 'Red Specimen Tank' },
        { id: 'f13_lob_tr', x: 9, y: 2, type: 'prop', name: 'Green Specimen Tank' },
        { id: 'f14_lob_tr', x: 9, y: 3, type: 'prop', name: 'Green Specimen Tank' },
        { id: 'jenzi', x: 4, y: 4, type: 'npc', name: 'Jenzi', quests: ['quest_main_datapad'] },
        { id: 'f59_lob_nw', x: 1, y: 3, type: 'prop', name: 'Decorative Bush' },
        { id: 'f1_lobby_wait1', x: 1, y: 4, type: 'prop', name: 'Lab Chair', hiddenReward: 'REWARD_CREDITS_250' },
        { id: 'f1_lobby_wait2', x: 1, y: 5, type: 'prop', name: 'Lab Chair' },
        { id: 'f56_reception', x: 8, y: 5, type: 'prop', name: 'Leader Table' },
        { id: 'f57_reception', x: 8, y: 6, type: 'prop', name: 'Leader Table' },
        { id: 'f0_reception_desk', x: 9, y: 5, type: 'prop', name: 'Lab Chair' },
        { id: 'f6_lob1', x: 4, y: 2, type: 'prop', name: 'Lab Protocol' },
        { id: 'f17_lob1', x: 6, y: 2, type: 'prop', name: 'Wall Protocol' },
        { id: 'f59_lob1', x: 4, y: 3, type: 'prop', name: 'Decorative Bush' },
        { id: 'f59_lob2', x: 6, y: 3, type: 'prop', name: 'Decorative Bush' },
        { id: 'f59_lob3', x: 1, y: 6, type: 'prop', name: 'Decorative Bush' },
        { id: 'f59_lob4', x: 9, y: 6, type: 'prop', name: 'Decorative Bush' },
        { id: 'pax', x: 7, y: 5, type: 'npc', name: 'Receptionist Pax' }
    ],
    doors: [
        { x: 5, y: 2, targetZone: 'atrium', targetX: 9, targetY: 13, requiredFlag: 'jenziAtriumUnlocked' }
    ]
};

