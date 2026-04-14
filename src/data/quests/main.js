/**
 * MAIN_QUESTS: Story-critical progression tasks.
 * These drive the narrative forward and often unlock new sectors.
 */
export const MAIN_QUEST_DATA = {
    'quest_main_datapad': {
        id: 'quest_main_datapad',
        title: 'Archive Initialization',
        description: "Retrieve Log #001 from the Specimen Storage sector to restore the core database.",
        type: 'collect',
        target: 'Log001', 
        amount: 1,
        reward: { type: 'resource', id: 'credits', amount: 500 },
        requiredFlag: 'jenziFirstBattleDone',
        onCompleteFlag: 'jenziAtriumUnlocked', 
        consume: false,
        dialogue: {
            offer: [
                "Ayo, not bad for a first-timer! You've got that 'pioneer spirit' everyone talks about.",
                "Win or lose, you've been brave enough to test that Cell today. Respect.",
                "Wait, did you see that? Something just flashed over by the specimen tanks.",
                "Go check if someone dropped something in there.",
                "I swear, these scientists have the attention span of a goldfish once they leave their desks."
            ],
            progress: ["Still looking for that flash? It was definitely over near the tanks."],
            complete: [
                "Aha! A lost Datapad. People here would forget their own heads if they weren't attached.",
                "Collect 'em and bring 'em to me, okay? I'll 'officially' return them to the owners.",
                "Door to the Atrium is open now. Go explore, but don't get lost in the sauce."
            ],
            finished: ["The Atrium holds a lot more secrets than just logs. Be careful out there."]
        }
    },
    'quest_main_atrium_proof': {
        id: 'quest_main_atrium_proof',
        title: 'The Atrium Proof',
        description: "Collect 5 DataLogs total and defeat Jenzi to prove you can handle the Botanic Sector.",
        type: 'defeat',
        target: 'jenzi_atrium',
        amount: 1,
        requiredLogs: 5,
        requiredFlag: 'jenziAtriumUnlocked',
        onCompleteFlag: 'botanicSectorUnlocked',
        reward: { type: 'resource', id: 'credits', amount: 1000 },
        dialogue: {
            offer: [
                "You've been busy! 5 Datapads already? Lowkey impressive.",
                "Then you must smell something fishy about the Incident.",
                "But before I tell you about the 'smell', let's see if you're actually worth it.",
                "My Stemmy is ready to rumble. Pelli-it up!"
            ],
            progress: ["Pelli-it up, Intern! Let's see what you've got."],
            complete: [
                "Okay, okay, you got me! You're actually decent.",
                "Since you won, here's the tea about 'The Incident'. Director Capsain says it was an 'Ionization Leak'.",
                "Something about that story just isn't right... Well beat me, what do I know.",
                "If you want the real story, go ask Lana in the Botanic wing. She's the main character of that floor anyway.",
                "I've unlocked the door for you. Keep collecting those logs!"
            ],
            finished: ["Lana is a bit of a mood, but she knows the truth about the reactor logs."]
        }
    },
    'quest_main_lana_key': {
        id: 'quest_main_lana_key',
        title: 'Botanical Security',
        description: "Prove your tactical skill to Lana (10 Logs required) to secure the Old Lab Key.",
        type: 'defeat',
        target: 'lana',
        amount: 1,
        requiredLogs: 10,
        requiredFlag: 'botanicSectorUnlocked',
        onCompleteFlag: 'lanaBattleDone',
        reward: { type: 'item', id: 'Quest01' },
        dialogue: {
            offer: [
                "Wait. You've been poking around the botanical archives, haven't you?",
                "Look, I love these cells, but the Director says we have to keep the research classified.",
                "If you want that Old Lab Key, you'll have to prove you can handle the truth in a duel!",
                "Prepare for a lesson in botanical efficiency!"
            ],
            progress: ["Hmph. Just as I suspected. // Your tactical calibration is completely non-existent! // Go back to the entrance and... and don't come back until you've read at least three field guides! Honestly!"],
            complete: [
                "Fine! You win! *[Mutters]* Just like the Director during the Leak... always so stubborn.",
                "Here, take this Old Lab Room Key. It's for some old storage room.",
                "Just... don't believe everything you read in the logs."
            ],
            finished: ["Your tactical signature is... informative. Don't waste my time with more questions."]
        }
    },
    'quest_main_dyzes_data': {
        id: 'quest_main_dyzes_data',
        title: 'Osmotic Revelations',
        description: "Defeat Dyzes (15 Logs required) to retrieve the Old Data Stick.",
        type: 'defeat',
        target: 'dyzes_boss',
        amount: 1,
        requiredLogs: 15,
        requiredFlag: 'lanaBattleDone',
        onCompleteFlag: 'dyzesBattleDone',
        reward: { type: 'item', id: 'Quest03' },
        dialogue: {
            offer: [
                "I've seen your log activity. You're piecing together 'The Incident', aren't you?",
                "Capsain is a good man, just... proud.",
                "I can't let you expose him without a proper test of your tactical skill.",
                "Prepare yourself!",
                "Let's see if your tactical vibe is strong enough."
            ],
            progress: ["Woah, man. You're a bit out of sync. Take a breather, hydrate, and maybe try focusing on the flow next time. No rush."],
            complete: [
                "Woah, okay. Your tactical flow is elite. I can't really hide the truth if you're this good.",
                "The Old Lab exists, man. It's not on the main maps.",
                "Wait, let me give you this old data stick I found in the archives.",
                "It contains a floor plan that reveals the hidden lab location.",
                "Go talk to Jenzi. She'll level with you about how to get in.",
                "Capsain is just... he's protective, you know? Good luck."
            ],
            finished: ["Don't mind the hum. That's just the sound of cellular harmony."]
        }
    },
    'quest_main_capsain_final': {
        id: 'quest_main_capsain_final',
        title: 'The Origin Theory',
        description: "Confront Director Capsain (20 Logs required) to reveal the truth.",
        type: 'defeat',
        target: 'capsain',
        amount: 1,
        requiredLogs: 20,
        requiredFlag: 'dyzesBattleDone',
        onCompleteFlag: 'capsainBattleDone',
        reward: { type: 'item', id: 'Quest02' },
        dialogue: {
            offer: [
                "So. You found the Noodle Review. You found the '27 security gap.",
                "You think a little chili sauce is enough to topple this Director?",
                "Fine. If you want the 'Origin', you'll have to go through me and my strongest Nitrophil first!",
                "I won't have my legacy tarnished by some spicy gossip!",
                "Prepare to be archived!"
            ],
            progress: ["Dismissed. If you can't even handle a basic engagement, you have no business poking around the archives. // Go back to filing paperwork, Intern."],
            complete: [
                "I... I failed? To an intern? *[Sighs deeply]*",
                "You've seen the logs. You have the sauce. You've basically already found out.",
                "Here, take this Rare Inferno Sauce... it's just a research sample! Nothing more!",
                "Now go away, I have... important papers to write."
            ],
            finished: ["I tried to tell them it was radiation. I told the board we were pioneers..."]
        }
    },
    'quest_main_origin_secret': {
        id: 'quest_main_origin_secret',
        title: 'The Origin Secret',
        description: "Find the Old Lab Room and the Origin Nitrophil to complete the mystery.",
        type: 'collect',
        target: 'Quest04',
        amount: 1,
        requiredFlag: 'capsainBattleDone',
        onCompleteFlag: 'gameEndTriggered',
        reward: { type: 'resource', id: 'credits', amount: 5000 },
        dialogue: {
            offer: [
                "You have all the clues now. Find that Old Lab Room. That's where the final secret is hidden.",
                "Find the Old Lab Room -> Read Final Datalog -> Take Origin Nitrophil to Director -> Game End."
            ],
            progress: ["Still searching for the hidden room? It's not on the main maps."],
            complete: [
                "You found it. The Origin Nitrophil. It's... it's orange.",
                "The spicy miracle that started it all.",
                "Congratulations, Specialist. You've uncovered the true heart of Odd Labs."
            ],
            finished: ["The Lab is finally at peace. The truth is out."]
        }
    }
};

/**
 * MAIN_QUEST_LOGS: Narrative "Diary" entries.
 * These provide flavor and context for the player's current story stage.
 */
export const MAIN_QUEST_LOGS = {
    'initialization': {
        title: '[MAIN] PROTOCOL: INITIALIZATION',
        objective: 'Select your first Companion Cell.',
        narrative: 'Day 1 at Odd Labs. Honestly? This place is terrifyingly beautiful. I\'m supposed to \'pair\' with a sentient cell today. They\'re way bigger than the textbooks said, and they almost seem to be watching me back. Time to see which one wants to be my partner in this maze.'
    },
    'first_duel': {
        title: '[MAIN] THE GATEKEEPER\'S VIBE',
        objective: 'Survive Jenzi\'s introductory diagnostic.',
        narrative: 'Jenzi’s got this refreshing, honest energy that actually makes me believe her when she says I’ve got potential. She isn’t just being nice—she’s testing me because she thinks I can handle it. If I can win this duel, I’ll know for sure that I’m not just another hire, but someone who actually belongs in this Lab.'
    },
    'atrium_threshold': {
        title: '[MAIN] THE ATRIUM THRESHOLD',
        objective: 'Retrieve Log #001 from Specimen Storage.',
        narrative: 'Phew, what a test. The Atrium doors are still locked, and Jenzi is playing coy. She hinted that someone dropped a datapad near the specimen tanks in this wing. I need to find it.'
    },
    'atrium_archive': {
        title: '[MAIN] ATRIUM ARCHIVE',
        objective: 'Archive 5 DataLogs and battle Jenzi again.',
        narrative: 'I\'ve been scrounging through the Atrium desks. Mention of \'Point Zero\' and \'Noodle Tuesday\' is everywhere. Jenzi is ready to spill the \'tea\' about the Incident, but only if I win this next duel. She says the Director\'s story is fishy... well, more like spicy.'
    },
    'botanic_secrets': {
        title: '[MAIN] PETALS AND SECRETS',
        objective: 'Defeat Lana to secure the Old Lab Key.',
        narrative: 'Scientist Lana is... intense. She treats her Cambihils like royalty and me like a budget virus. She’s definitely hiding something about the Director\'s \'private research.\' If I want that key to the restricted wing, I\'m going to have to out-sync her in a fight.'
    },
    'osmotic_revelations': {
        title: '[MAIN] OSMOTIC REVELATIONS',
        objective: 'Defeat Dyzes to retrieve the Old Data Stick.',
        narrative: 'Dyzes is the \'chillest\' guy here, but even he looks nervous when I mention the Old Lab. He says the truth is \'fluid.\' He’s got an old data stick that supposedly maps out a hidden sector. If I can stay in sync during his Lydrosome test, I might finally have a map to the truth.'
    },
    'executive_truth': {
        title: '[MAIN] THE EXECUTIVE TRUTH',
        objective: 'Confront Director Capsain in his suite.',
        narrative: 'I have the key. I have the map. Now I just have the Director. Capsain looks like he hasn\'t slept since 2027. He’s a frantic mess of high-level anxiety and corporate paranoia, acting more like a man guarding a haunted house than a scientific research facility. Something tells me he’s much closer to the edge than he lets on. Is the head of Odd Labs really hiding a portal to a chili-based disaster?'
    },
    'spicy_origin': {
        title: '[MAIN] THE SPICY ORIGIN',
        objective: 'Locate the Origin Nitrophil in the Old Lab.',
        narrative: 'Capsain is down. He gave me a bottle of \'Inferno Sauce\' and looked like his world was ending. The secret is in the basement—the Old Lab. I\'m going to find the \'Origin.\' If the legend is true, this whole facility was built on a beautiful, spicy accident.'
    }
};
