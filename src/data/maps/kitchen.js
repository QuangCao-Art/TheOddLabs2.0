export const kitchen = {
    name: 'STAFF KITCHEN',
    width: 11,
    height: 8,
    spawn: { x: 7, y: 6 },
    layout: [
        [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
        [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11],
        [10, 15, 15, 15, 15, 15, 15, 22, 15, 15, 11],
        [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
        [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 25],
        [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
        [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
        [2, 9, 9, 9, 9, 9, 9, 20, 9, 9, 3]
    ],
    objects: [
        { id: 'f67_kitL', x: 1, y: 2, type: 'prop', name: 'Odd-Vend', customSprite: 'VendingMachine-TopLeft tileset-03' },
        { id: 'f68_kitL', x: 2, y: 2, type: 'prop', name: 'Odd-Vend', customSprite: 'VendingMachine-TopRight tileset-03' },
        { id: 'f69_kitL', x: 1, y: 3, type: 'prop', name: 'Odd-Vend', customSprite: 'VendingMachine-BottomLeft tileset-03' },
        { id: 'f70_kitL', x: 2, y: 3, type: 'prop', name: 'Odd-Vend', customSprite: 'VendingMachine-BottomRight tileset-03' },
        { id: 'f67_kitR', x: 8, y: 2, type: 'prop', name: 'Odd-Vend', customSprite: 'VendingMachine-TopLeft tileset-03' },
        { id: 'f68_kitR', x: 9, y: 2, type: 'prop', name: 'Odd-Vend', customSprite: 'VendingMachine-TopRight tileset-03' },
        { id: 'f69_kitR', x: 8, y: 3, type: 'prop', name: 'Odd-Vend', customSprite: 'VendingMachine-BottomLeft tileset-03' },
        { id: 'f70_kitR', x: 9, y: 3, type: 'prop', name: 'Odd-Vend', customSprite: 'VendingMachine-BottomRight tileset-03' },
        { id: 'f36_kit1', x: 3, y: 3, type: 'prop', name: 'Quick Bite', hiddenLogId: 'Log008' },
        { id: 'f36_kit2', x: 4, y: 3, type: 'prop', name: 'Forgotten Lunch' },
        { id: 'f60_kit_trash', x: 5, y: 3, type: 'prop', name: 'Trash Box' },
        { id: 'f37_kit1', x: 6, y: 3, type: 'prop', name: 'Empty Bowl' },
        { id: 'f1_kit1', x: 1, y: 4, type: 'prop', name: 'Kitchen Chair' },
        { id: 'f1_kit2', x: 1, y: 5, type: 'prop', name: 'Kitchen Chair' },
        { id: 'f3_kit1', x: 3, y: 5, type: 'prop', name: 'Coffee Table' },
        { id: 'f3_kit2', x: 5, y: 5, type: 'prop', name: 'Coffee Table' },
        { id: 'f36_kit4', x: 8, y: 6, type: 'prop', name: 'Mid-Day Snack' },
        { id: 'f3_kit3', x: 9, y: 6, type: 'prop', name: 'Coffee Table' },
        { id: 'f59_kit1', x: 1, y: 6, type: 'prop', name: 'Kitchen Fern' },
        { id: 'f60_kit1', x: 2, y: 6, type: 'prop', name: 'Supplies' },
        { id: 'f59_kit3', x: 3, y: 6, type: 'prop', name: 'Kitchen Fern' },
        { id: 'f36_kit3', x: 4, y: 6, type: 'prop', name: 'Abandoned Snack' },
        { id: 'f59_kit2', x: 5, y: 6, type: 'prop', name: 'Kitchen Fern' },
        {
            id: 'npc_male_theo', x: 4, y: 5, type: 'npc', name: 'Chef Theo', direction: 'down',
            battleEncounterId: 'theo',
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
        { id: 'npc_female_mia', x: 9, y: 5, type: 'npc', name: 'Researcher Mia', direction: 'down' }
    ],
    doors: [
        { x: 10, y: 4, targetZone: 'atrium', targetX: 1, targetY: 7 },
        { x: 7, y: 2, targetZone: 'botanic', targetX: 7, targetY: 14 },
        { x: 7, y: 7, targetZone: 'entertainment', targetX: 7, targetY: 3, requiredFlag: 'botanicSectorUnlocked' }
    ]
};
