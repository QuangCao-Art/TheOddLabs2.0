export const entertainment = {
    name: 'ENTERTAINMENT LOUNGE',
    width: 10,
    height: 8,
    spawn: { x: 8, y: 6 },
    layout: [
        [0, 8, 8, 8, 8, 8, 8, 8, 8, 1],
        [10, 14, 14, 14, 62, 14, 48, 50, 51, 11],
        [10, 63, 15, 15, 15, 15, 49, 22, 52, 11],
        [10, 13, 65, 13, 13, 13, 13, 45, 13, 11],
        [10, 13, 13, 13, 13, 13, 65, 13, 13, 11],
        [10, 13, 13, 44, 13, 13, 13, 13, 13, 11],
        [24, 45, 13, 13, 13, 13, 13, 44, 45, 25],
        [2, 9, 9, 9, 9, 9, 9, 9, 9, 3]
    ],
    objects: [
        { "id": "panto", "x": 2, "y": 5, "type": "npc", "name": "Researcher Panto", "direction": "down" },
        { "id": "saito", "x": 3, "y": 3, "type": "npc", "name": "Assistant Saito", "direction": "down" },
        { "id": "f1_ent3", "x": 1, "y": 5, "type": "prop", "templateName": "CHAIR_A_R" },
        { "id": "f7_ent", "x": 8, "y": 4, "type": "prop", "hiddenLogId": "Log003", "templateName": "TABLE_COMPUTER" },
        { "id": "f0_mnx3e0252upcz", "templateName": "CHAIR_A_L", "x": 8, "y": 5, "type": "prop", "mirrored": false },
        { "id": "f73_mnx3fcassid79", "templateName": "BATTLE_MACHINE", "x": 4, "y": 5, "type": "prop", "mirrored": false, "hiddenReward": "REWARD_CREDITS_100" },
        { "id": "f74_mnx3fcassid79", "templateName": "BATTLE_MACHINE", "x": 5, "y": 5, "type": "prop", "mirrored": false, "hiddenReward": "REWARD_CREDITS_100" },
        { "id": "f71_mnx3fcassid79", "templateName": "BATTLE_MACHINE", "x": 4, "y": 4, "type": "prop", "mirrored": false, "hiddenReward": "REWARD_CREDITS_100" },
        { "id": "f72_mnx3fcassid79", "templateName": "BATTLE_MACHINE", "x": 5, "y": 4, "type": "prop", "mirrored": false, "hiddenReward": "REWARD_CREDITS_100" },
        { "id": "f125_mnx3fmdzzjksg", "templateName": "POSTER_TROUBLEMAKERS", "x": 2, "y": 2, "type": "prop", "mirrored": false, "hiddenReward": "REWARD_CREDITS_50" },
        { "id": "f126_mnx3fwvuyhgyt", "templateName": "POSTER_SILENT_EMPLOYEE", "x": 4, "y": 2, "type": "prop", "mirrored": false },
        { "id": "f127_mnx3ggn58mru5", "templateName": "WALL_OF_STICKERS", "x": 5, "y": 2, "type": "prop", "mirrored": false },
        { "id": "f127_mnx3gnil6kvkv", "templateName": "WALL_OF_STICKERS", "x": 1, "y": 2, "type": "prop", "mirrored": true },
        { "id": "f0_mnx3gxnfst8cd", "templateName": "CHAIR_A_L", "x": 1, "y": 4, "type": "prop", "mirrored": true },
        { "id": "f59_mnx3hb72qca3h", "templateName": "POT_PLANT_SMALL", "x": 1, "y": 3, "type": "prop", "mirrored": true },
        { "id": "f110_mnx3ihknd76vq", "templateName": "HUGE_PETRY_DISH", "x": 5, "y": 3, "type": "prop", "mirrored": true },
        { "id": "f109_mnx3ihknd76vq", "templateName": "HUGE_PETRY_DISH", "x": 5, "y": 2, "type": "prop", "mirrored": true },
        { "id": "f103_mnx3iitlba3f6", "templateName": "HUGE_PETRI_DISH_SINGLE", "x": 4, "y": 3, "type": "prop", "mirrored": true },
        { "id": "f59_mnx3isqkyrz9p", "templateName": "POT_PLANT_SMALL", "x": 8, "y": 3, "type": "prop", "mirrored": true },
        { "id": "f127_mnx3k4v3s6jp3", "templateName": "WALL_OF_STICKERS", "x": 3, "y": 2, "type": "prop", "mirrored": true }
    ],
    doors: [
        { "x": 9, "y": 6, "targetZone": "atrium", "targetX": 1, "targetY": 10 },
        { "x": 7, "y": 2, "targetZone": "kitchen", "targetX": 7, "targetY": 6, "requiredFlag": "botanicSectorUnlocked" },
        { "x": 0, "y": 6, "targetZone": "cellPlayGround", "targetX": 15, "targetY": 7 }
    ]
};
