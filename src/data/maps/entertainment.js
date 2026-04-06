export const entertainment = {
    name: 'ENTERTAINMENT LOUNGE',
    width: 10,
    height: 8,
    spawn: { x: 8, y: 6 },
    layout: [
        [0, 8, 8, 8, 8, 8, 8, 8, 8, 1],
        [10, 14, 14, 14, 14, 14, 14, 14, 14, 11],
        [10, 15, 15, 15, 15, 15, 15, 22, 15, 11],
        [10, 13, 13, 13, 13, 13, 13, 13, 13, 11],
        [10, 13, 13, 13, 13, 13, 13, 13, 13, 11],
        [10, 13, 13, 13, 13, 13, 13, 13, 13, 11],
        [24, 13, 13, 13, 13, 13, 13, 13, 13, 25],
        [2, 9, 9, 9, 9, 9, 9, 9, 9, 3]
    ],
    objects: [
        { id: 'f1_ent1', x: 1, y: 3, type: 'prop', name: 'Lounge Seat' },
        { id: 'f1_ent2', x: 1, y: 4, type: 'prop', name: 'Lounge Seat' },
        { id: 'f1_ent3', x: 1, y: 5, type: 'prop', name: 'Lounge Seat' },
        { id: 'f0_ent1', x: 8, y: 3, type: 'prop', name: 'Lounge Seat' },
        { id: 'f7_ent', x: 8, y: 4, type: 'prop', name: 'Lounge PC', hiddenLogId: 'Log003' },
        { id: 'f0_ent2', x: 8, y: 5, type: 'prop', name: 'Lounge Seat' },
        { id: 'f6_ent1', x: 1, y: 2, type: 'prop', name: 'Art Display' },
        { id: 'f6_ent2', x: 3, y: 2, type: 'prop', name: 'Art Display' },
        { id: 'f6_ent3', x: 5, y: 2, type: 'prop', name: 'Art Display' },
        { id: 'f71_ent', x: 4, y: 4, type: 'prop', name: 'Battle Machine', customSprite: 'BattleMachine-TopLeft tileset-03' },
        { id: 'f72_ent', x: 5, y: 4, type: 'prop', name: 'Battle Machine', customSprite: 'BattleMachine-TopRight tileset-03' },
        { id: 'f73_ent', x: 4, y: 5, type: 'prop', name: 'Battle Machine', customSprite: 'BattleMachine-BottomLeft tileset-03' },
        { id: 'f74_ent', x: 5, y: 5, type: 'prop', name: 'Battle Machine', customSprite: 'BattleMachine-BottomRight tileset-03' },
        { id: 'panto', x: 2, y: 5, type: 'npc', name: 'Researcher Panto', direction: 'down' },
        {
            id: 'saito', x: 3, y: 3, type: 'npc', name: 'Assistant Saito', direction: 'down',
            battleEncounterId: 'saito',
            dialogue: ["Oh, you're looking for Sapstan and Blundur's lost datapads?", "I might have seen them... but I won't tell you for free!", "Let's have a quick Cell battle. If you win, I'll give you a hint!"],
            npcWinDialogue: ["Better luck next time!", "Since I'm nice, here's a tip: There's a Console Station in the Atrium near the north wall...", "It's humming a bit strangely. Check the ports, maybe someone left a datapad plugged in!"],
            npcLossDialogue: ["Fine, you're better than you look!", "Check the Atrium. There's a pile of boxes near the south exit...", "Something shiny is tucked inside one of them. Happy hunting!"]
        }
    ],
    doors: [
        { x: 9, y: 6, targetZone: 'atrium', targetX: 1, targetY: 10 },
        { x: 7, y: 2, targetZone: 'kitchen', targetX: 7, targetY: 6, requiredFlag: 'botanicSectorUnlocked' },
        { x: 0, y: 6, targetZone: 'cellPlayGround', targetX: 15, targetY: 6 }
    ]
};
