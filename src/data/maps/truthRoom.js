export const truthRoom = {
    name: 'THE TRUTH ROOM',
    width: 11,
    height: 8,
    spawn: { x: 5, y: 3 },
    layout: [
        [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
        [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11],
        [10, 15, 15, 15, 15, 22, 15, 15, 15, 15, 11],
        [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
        [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
        [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
        [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
        [2, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3]
    ],
    objects: [],
    spawnPool: { stemmy: 60, nitrophil: 10, cambihil: 20, lydrosome: 10 },
    doors: [
        { x: 5, y: 2, targetZone: 'specimenStorage', targetX: 13, targetY: 6 }
    ]
};
