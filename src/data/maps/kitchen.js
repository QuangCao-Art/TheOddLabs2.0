export const kitchen = {
    name: 'STAFF KITCHEN',
    width: 11,
    height: 8,
    spawn: { x: 7, y: 6 },
    layout: [
        [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
        [10, 62, 14, 14, 14, 14, 48, 50, 51, 14, 11],
        [10, 15, 15, 32, 59, 15, 49, 22, 52, 15, 11],
        [10, 13, 44, 13, 13, 13, 44, 13, 44, 13, 11],
        [10, 44, 13, 13, 13, 13, 13, 65, 13, 13, 25],
        [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
        [10, 13, 13, 13, 13, 13, 65, 13, 13, 13, 11],
        [2, 9, 9, 9, 9, 9, 9, 20, 9, 9, 3]
    ],
    objects: [
        {
            id: 'rattou', x: 4, y: 5, type: 'npc', name: 'Chef Rattou', direction: 'down',
            battleEncounterId: 'rattou',
            dialogue: [
                "Hungry for progress, Intern? Cooking's all about preparation.",
                "Have you used the Vending Machine here in the Kitchen?",
                "It’s not just for snacks like noodles; it’s essential for trading Biomass and acquiring Blueprints.",
                "Let me show you why stayin' stocked is stayin' alive!"
            ],
            npcWinDialogue: [
                "Sloppy! You came in underprepared.",
                "Make sure to stop by the Vending Machine.",
                "It sells more than just food; you can trade in your excess Biomass for Lab credits, then use those credits to buy Blueprints for advanced Cells."
            ],
            npcLossDialogue: [
                "Delicious work! You've got the hunger.",
                "The Vending Machine here is more than just furniture.",
                "It’s not just for grabbing a quick bite like noodles; use your Lab credits to get stock!",
                "So remember to visit it to stock up sometime."
            ]
        },
        { id: 'furaijika', x: 9, y: 5, type: 'npc', name: 'Researcher Furaijika', direction: 'down' },
        { id: 'f67_kitL', x: 1, y: 2, type: 'prop', customSprite: 'VendingMachine-TopLeft tileset-03', templateName: 'VENDING_MACHINE' },
        { id: 'f68_kitL', x: 2, y: 2, type: 'prop', customSprite: 'VendingMachine-TopRight tileset-03', templateName: 'VENDING_MACHINE' },
        { id: 'f69_kitL', x: 1, y: 3, type: 'prop', customSprite: 'VendingMachine-BottomLeft tileset-03', templateName: 'VENDING_MACHINE' },
        { id: 'f70_kitL', x: 2, y: 3, type: 'prop', customSprite: 'VendingMachine-BottomRight tileset-03', templateName: 'VENDING_MACHINE' },
        { id: 'f67_kitR', x: 8, y: 2, type: 'prop', customSprite: 'VendingMachine-TopLeft tileset-03', templateName: 'VENDING_MACHINE' },
        { id: 'f68_kitR', x: 9, y: 2, type: 'prop', customSprite: 'VendingMachine-TopRight tileset-03', templateName: 'VENDING_MACHINE' },
        { id: 'f69_kitR', x: 8, y: 3, type: 'prop', customSprite: 'VendingMachine-BottomLeft tileset-03', templateName: 'VENDING_MACHINE' },
        { id: 'f70_kitR', x: 9, y: 3, type: 'prop', customSprite: 'VendingMachine-BottomRight tileset-03', templateName: 'VENDING_MACHINE' },
        { id: 'f36_kit1', x: 3, y: 3, type: 'prop', hiddenLogId: 'Log008', templateName: 'NOODLE_TABLE' },
        { id: 'f60_kit_trash', x: 5, y: 3, type: 'prop', templateName: 'SMALL_BOX' },
        { id: 'f37_kit1', x: 6, y: 3, type: 'prop', templateName: 'NOODLE_BOWL' },
        { id: 'f1_kit1', x: 1, y: 4, type: 'prop', templateName: 'CHAIR_A_R' },
        { id: 'f3_kit1', x: 3, y: 5, type: 'prop', templateName: 'TABLE_A' },
        { id: 'f3_kit2', x: 5, y: 5, type: 'prop', templateName: 'TABLE_A' },
        { id: 'f59_kit1', x: 1, y: 6, type: 'prop', templateName: 'POT_PLANT_SMALL' },
        { id: 'f60_kit1', x: 2, y: 6, type: 'prop', templateName: 'SMALL_BOX' },
        { id: 'f59_kit3', x: 3, y: 6, type: 'prop', templateName: 'POT_PLANT_SMALL' },
        { id: 'f59_kit2', x: 5, y: 6, type: 'prop', templateName: 'POT_PLANT_SMALL' },
        { id: 'f1_mny5m5solc5l9', templateName: 'CHAIR_A_R', x: 1, y: 5, type: 'prop', mirrored: false, hiddenReward: 'REWARD_CREDITS_10' },
        { id: 'f36_mny5m9mjgmytl', templateName: 'NOODLE_TABLE', x: 4, y: 3, type: 'prop', mirrored: false, hiddenReward: 'REWARD_CREDITS_50' },
        { id: 'f36_mny5mhq0bj34p', templateName: 'NOODLE_TABLE', x: 9, y: 6, type: 'prop', mirrored: false },
        { id: 'f3_mny5mkb1fr1cu', templateName: 'TABLE_A', x: 8, y: 6, type: 'prop', mirrored: false },
        { id: 'f36_mny5mox0f8r6g', templateName: 'NOODLE_TABLE', x: 4, y: 6, type: 'prop', mirrored: false, hiddenReward: 'REWARD_CREDITS_50' },
        { id: 'f37_mny5n74tnq3y4', templateName: 'NOODLE_BOWL', x: 6, y: 6, type: 'prop', mirrored: false, hiddenReward: 'REWARD_CREDITS_50' },
        { id: 'f126_mny5no76ukybz', templateName: 'POSTER_SILENT_EMPLOYEE', x: 5, y: 2, type: 'prop', mirrored: false, hiddenReward: 'REWARD_CREDITS_50' }
    ],
    doors: [
        { x: 10, y: 4, targetZone: 'atrium', targetX: 1, targetY: 7 },
        { x: 7, y: 2, targetZone: 'botanic', targetX: 7, targetY: 14 },
        { x: 7, y: 7, targetZone: 'entertainment', targetX: 7, targetY: 3, requiredFlag: 'botanicSectorUnlocked' }
    ]
};

