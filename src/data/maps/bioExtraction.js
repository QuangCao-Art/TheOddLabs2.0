export const bioExtraction = {
    name: 'BIO EXTRACTION ROOM',
    width: 8,
    height: 10,
    spawn: { x: 5, y: 3 },
    layout: [
        [0, 8, 8, 8, 8, 8, 8, 1],
        [10, 14, 62, 14, 48, 50, 51, 11],
        [10, 56, 43, 15, 49, 22, 52, 11],
        [10, 13, 13, 13, 13, 45, 13, 11],
        [10, 38, 65, 13, 13, 13, 38, 11],
        [10, 38, 13, 38, 38, 13, 38, 11],
        [10, 38, 13, 38, 38, 13, 38, 11],
        [10, 38, 13, 13, 13, 65, 38, 11],
        [10, 13, 38, 38, 38, 38, 13, 11],
        [2, 9, 9, 9, 9, 9, 9, 3]
    ],
    objects: [
        { id: 'f42_bio', x: 3, y: 4, type: 'prop', templateName: 'BIO_EXTRACTOR' },
        { id: 'f43_bio', x: 4, y: 4, type: 'prop', templateName: 'BIO_EXTRACTOR' },
        { id: 'f44_bio', x: 3, y: 5, type: 'prop', templateName: 'BIO_EXTRACTOR' },
        { id: 'f45_bio', x: 4, y: 5, type: 'prop', templateName: 'BIO_EXTRACTOR' },
        { id: 'f46_bio', x: 3, y: 6, type: 'prop', templateName: 'BIO_EXTRACTOR' },
        { id: 'f47_bio', x: 4, y: 6, type: 'prop', templateName: 'BIO_EXTRACTOR' },
        { id: 'f59_bio_sw', x: 1, y: 8, type: 'prop', templateName: 'POT_PLANT_SMALL' },
        { id: 'f59_bio_se', x: 6, y: 8, type: 'prop', templateName: 'POT_PLANT_SMALL' },
        { id: 'f103_bio_l1', x: 1, y: 4, type: 'prop', templateName: 'HUGE_PETRI_DISH_SINGLE' },
        { id: 'f103_bio_l2', x: 1, y: 5, type: 'prop', templateName: 'HUGE_PETRI_DISH_SINGLE' },
        { id: 'f103_bio_l3', x: 1, y: 6, type: 'prop', templateName: 'HUGE_PETRI_DISH_SINGLE' },
        { id: 'f103_bio_l4', x: 1, y: 7, type: 'prop', templateName: 'HUGE_PETRI_DISH_SINGLE' },
        { id: 'f103_bio_r1', x: 6, y: 4, type: 'prop', templateName: 'HUGE_PETRI_DISH_SINGLE' },
        { id: 'f103_bio_r2', x: 6, y: 5, type: 'prop', templateName: 'HUGE_PETRI_DISH_SINGLE' },
        { id: 'f103_bio_r3', x: 6, y: 6, type: 'prop', templateName: 'HUGE_PETRI_DISH_SINGLE' },
        { id: 'f103_bio_r4', x: 6, y: 7, type: 'prop', templateName: 'HUGE_PETRI_DISH_SINGLE' },
        { id: 'f103_bio_s1', x: 2, y: 8, type: 'prop', templateName: 'HUGE_PETRI_DISH_SINGLE' },
        { id: 'f103_bio_s2', x: 3, y: 8, type: 'prop', templateName: 'HUGE_PETRI_DISH_SINGLE' },
        { id: 'f103_bio_s3', x: 4, y: 8, type: 'prop', templateName: 'HUGE_PETRI_DISH_SINGLE' },
        { id: 'f103_bio_s4', x: 5, y: 8, type: 'prop', templateName: 'HUGE_PETRI_DISH_SINGLE' },
        { id: 'f59_mny5b74xrlp5o', templateName: 'POT_PLANT_SMALL', x: 1, y: 3, type: 'prop', mirrored: false },
        { id: 'f59_mny5b7pph518i', templateName: 'POT_PLANT_SMALL', x: 6, y: 3, type: 'prop', mirrored: false },
        { id: 'f8_mny5bl0xgjthd', templateName: 'TABLE_CYLINDERS', x: 4, y: 3, type: 'prop', mirrored: false, hiddenReward: 'REWARD_CREDITS_50' },
        { id: 'f26_mny5bwh8nt7yy', templateName: 'TABLE_D', x: 2, y: 3, type: 'prop', mirrored: false },
        { id: 'f27_mny5bwh8nt7yy', templateName: 'TABLE_D', x: 3, y: 3, type: 'prop', mirrored: false },
        { id: 'f127_mny5c9az4vkao', templateName: 'WALL_OF_STICKERS', x: 3, y: 2, type: 'prop', mirrored: false }
    ],
    doors: [
        { x: 5, y: 2, targetZone: 'atrium', targetX: 4, targetY: 13 }
    ]
};

