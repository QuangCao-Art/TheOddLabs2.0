export const QUESTS = {
    'quest_wild_stemmy': {
        id: 'quest_wild_stemmy',
        title: 'Wild Stemmy Hunt',
        type: 'defeat',
        target: 'stemmy_wild', // Matches opponentId in main.js
        amount: 5,
        reward: { type: 'log', id: 'Log010' },
        consume: false,
        dialogue: {
            offer: ["I'm doing research on Stemmy behavior.", "Could you defeat 5 Wild Stemmies for me?"],
            progress: ["How's the hunt going?", "You've defeated {progress} out of 5."],
            complete: ["Wow, you did it!", "Here is a datalog for your trouble."],
            finished: ["Thanks again for the help!"]
        }
    },
    'quest_nitrophil_synth': {
        id: 'quest_nitrophil_synth',
        title: 'Synthesis Practice',
        type: 'synthesis',
        target: 'nitrophil',
        amount: 1,
        reward: { type: 'item', id: 'CARD01' }, // Example card
        consume: false,
        dialogue: {
            offer: ["I need a Nitrophil cell for an experiment.", "Could you synthesize one for me?"],
            progress: ["Still waiting on that Nitrophil...", "Remember, you need Biomass and a Blueprint."],
            complete: ["Perfect specimen!", "Please take this C-Card as payment."],
            finished: ["Nitrophil is a fascinating unit, isn't it?"]
        }
    },
    'quest_collect_key': {
        id: 'quest_collect_key',
        title: 'Lost Property',
        type: 'collect',
        target: 'Quest01', // ID from Overworld objects/Item pickups
        amount: 1,
        reward: { type: 'resource', id: 'credits', amount: 500 },
        consume: true,
        dialogue: {
            offer: ["I lost my old Key Card somewhere in the Botanic Sector.", "If you find it, I'll pay you well."],
            progress: ["Any luck finding that Key Card?", "It should be near some plants."],
            complete: ["My Key Card! Thank you so much.", "Here are the credits I promised."],
            finished: ["I should really be more careful with my belongings."]
        }
    }
};
