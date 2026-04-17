export const lobby = {
    name: 'LAB LOBBY',
    width: 11,
    height: 8,
    spawn: { x: 5, y: 6 },
    layout: [
        [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
        [10, 14, 60, 14, 48, 50, 51, 14, 60, 55, 11],
        [10, 33, 61, 33, 49, 22, 52, 33, 61, 33, 11],
        [10, 13, 38, 38, 13, 45, 13, 38, 38, 38, 11],
        [10, 13, 44, 13, 13, 13, 13, 13, 13, 65, 11],
        [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
        [10, 13, 13, 13, 65, 45, 13, 13, 13, 13, 11],
        [2, 9, 9, 9, 9, 29, 9, 9, 9, 9, 3]
    ],
    objects: [
        { id: 'jenzi', x: 4, y: 4, type: 'npc', name: 'Jenzi', quests: ['quest_main_datapad', 'quest_main_atrium_proof', 'quest_main_origin_secret'] },
        { id: 'pax', x: 7, y: 5, type: 'npc', name: 'Receptionist Pax' },
        { id: 'f14_mny4vpl6jp1dw', templateName: 'TANK_GREEN', x: 9, y: 3, type: 'prop', mirrored: false, hiddenReward: 'REWARD_CREDITS_10' },
        { id: 'f13_mny4vpl6jp1dw', templateName: 'TANK_GREEN', x: 9, y: 2, type: 'prop', mirrored: false, hiddenReward: 'REWARD_CREDITS_10' },
        { id: 'f57_mny4vteuebrx4', templateName: 'TABLE_LEADER_B', x: 8, y: 6, type: 'prop', mirrored: false, hiddenReward: 'REWARD_CREDITS_10' },
        { id: 'f56_mny4vteuebrx4', templateName: 'TABLE_LEADER_B', x: 8, y: 5, type: 'prop', mirrored: false, hiddenReward: 'REWARD_CREDITS_10' },
        { id: 'f125_mny4x24o706r1', templateName: 'POSTER_TROUBLEMAKERS', x: 6, y: 2, type: 'prop', mirrored: false },
        { id: 'f126_mny4x8n1kghm6', templateName: 'POSTER_SILENT_EMPLOYEE', x: 4, y: 2, type: 'prop', mirrored: true },
        { id: 'f1_mny4zmkrhy4io', templateName: 'CHAIR_A_R', x: 1, y: 4, type: 'prop', mirrored: false, hiddenReward: 'REWARD_CREDITS_10' },
        { id: 'f1_mny4zo1wsdy0q', templateName: 'CHAIR_A_R', x: 1, y: 5, type: 'prop', mirrored: false },
        { id: 'f40_mny4zuqqqe8w6', templateName: 'INCUBATOR', x: 2, y: 3, type: 'prop', mirrored: false },
        { id: 'f41_mny4zuqqqe8w6', templateName: 'INCUBATOR', x: 3, y: 3, type: 'prop', mirrored: false },
        { id: 'f38_mny4zuqqqe8w6', templateName: 'INCUBATOR', x: 2, y: 2, type: 'prop', mirrored: false },
        { id: 'f39_mny4zuqqqe8w6', templateName: 'INCUBATOR', x: 3, y: 2, type: 'prop', mirrored: false },
        { id: 'f0_mny5059y3ureo', templateName: 'CHAIR_A_L', x: 9, y: 5, type: 'prop', mirrored: false },
        { id: 'f59_mny50cp7en3t0', templateName: 'POT_PLANT_SMALL', x: 6, y: 3, type: 'prop', mirrored: false },
        { id: 'f59_mny50j3039odu', templateName: 'POT_PLANT_SMALL', x: 9, y: 6, type: 'prop', mirrored: false },
        { id: 'f59_mny50nx5dvli4', templateName: 'POT_PLANT_SMALL', x: 4, y: 3, type: 'prop', mirrored: false },
        { id: 'f59_mny50ofn3j24z', templateName: 'POT_PLANT_SMALL', x: 1, y: 3, type: 'prop', mirrored: false },
        { id: 'f59_mny50oypyrumb', templateName: 'POT_PLANT_SMALL', x: 1, y: 6, type: 'prop', mirrored: false },
        { id: 'f16_mo2bjf14xgcmi', templateName: 'TANK_BLUE', x: 7, y: 3, type: 'prop', mirrored: false, hiddenReward: 'REWARD_CREDITS_10' },
        { id: 'f15_mo2bjf14xgcmi', templateName: 'TANK_BLUE', x: 7, y: 2, type: 'prop', mirrored: false, hiddenReward: 'REWARD_CREDITS_10' },
        { id: 'f23_mo2bjgiszvm8w', templateName: 'TANK_RED', x: 8, y: 3, type: 'prop', mirrored: false, hiddenLogId: 'Log001' },
        { id: 'f22_mo2bjgiszvm8w', templateName: 'TANK_RED', x: 8, y: 2, type: 'prop', mirrored: false }
    ],
    doors: [
        { x: 5, y: 2, targetZone: 'atrium', targetX: 9, targetY: 13, requiredFlag: 'jenziAtriumUnlocked' }
    ]
};


