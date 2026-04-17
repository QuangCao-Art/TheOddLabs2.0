/**
 * MAIN_QUESTS: Story-critical progression tasks.
 * These drive the narrative forward and often unlock new sectors.
 */
export const MAIN_QUEST_DATA = {
    'quest_main_datapad': {
        id: 'quest_main_datapad',
        title: 'Archive Initialization',
        description: "Retrieve Log #001 from the Lab Lobby.",
        type: 'collect',
        target: 'Log001',
        amount: 1,
        reward: {
            type: 'resource_multi',
            rewards: [
                { type: 'resource', id: 'credits', amount: 200 },
                { type: 'exp', amount: 50 }
            ]
        },
        requiredFlag: 'jenziFirstBattleDone',
        onCompleteFlag: 'jenziAtriumUnlocked',
        advancesStoryStage: true,
        consume: false,
        dialogue: {
            offer: [
                "Ayo, not bad for a first-timer! You've got that 'pioneer spirit' everyone talks about.",
                "Win or lose, you've been brave enough to test that Cell today. Respect.",
                "Wait, did you see that? Something just flashed over by the specimen tanks.",
                "Go check if someone dropped something in there.",
                "I swear, these scientists have the attention span of a goldfish once they leave their desks."
            ],
            offer_completed: [
                "Ayo, not bad for a first-timer! You've got that 'pioneer spirit' everyone talks about.",
                "Win or lose, you've been brave enough to test that Cell today. Respect.",
                "Wait, what do we have here? Did you just pick up that Datapad",
                "I swear I saw someone left it near the red tank a minute before.",
                "These scientists have the attention span of a goldfish once they leave their desks."
            ],
            progress: ["Still looking for that flash? It was definitely over near the tanks."],
            complete: [
                "Aha! Indeed, you found the Datapad. People here would forget their own heads if they weren't attached.",
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
        target: 'jenzi',
        amount: 1,
        requiredLogs: 5,
        requiredFlag: 'jenziAtriumUnlocked',
        onCompleteFlag: 'botanicSectorUnlocked',
        advancesStoryStage: true,
        reward: { type: 'resource', id: 'credits', amount: 500 },
        dialogue: {
            offer: [
                "Looking for more logs?",
                "Then you must smell something fishy about the Incident.",
                "But before I tell you about the 'smell', let's see if you're actually worth it.",
                "Collect 5 logs and defeat me to prove you can handle the Botanic Sector."
            ],
            offer_completed: [
                "Got 5 logs already?",
                "Then you must smell something fishy about the Incident.",
                "But before I tell you about the 'smell', let's see if you're actually worth it.",
                "Defeat me to prove you can handle the Botanic Sector."
            ],
            progress: ["Aha! Still collecting logs? Come back when you've got at least 5."],
            complete: [
                "Okay, okay, you got me! You're actually decent.",
                "Since you won, here's the tea about 'The Incident'.",
                "Director Capsain says it was an 'Ionization Leak'.",
                "Something about that story just isn't right...",
                "If you want the real story, go ask Lana in the Botanic wing.",
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
        advancesStoryStage: true,
        reward: { type: 'item', id: 'Quest01' },
        dialogue: {
            offer: [
                "Oh, here we meet again, Intern. // I see you want to learn more about my plants, huh?",
                "Wait. You've been poking around the botanical archives, haven't you?",
                "You may have seen something, but you'll have to prove you can handle the truth in a duel!",
                "But honestly? I'm not sure if you're ready for it."
            ],
            progress: ["Why are you still here? Jenzi didn't give you any tasks?"],
            offer_completed: [
                "It's you again, Intern. // I see you've been busy studying our archives...",
                "You may have seen something, but you'll have to prove you can handle the truth in a duel!",
                "Let's see if you're actually ready for it!"
            ],
            complete: [
                "Fine! You win! *[Mutters]* Just like the Director... always so stubborn.",
                "Here, take this Old Lab Room Key. It's for some old storage room.",
                "Just... don't believe everything you read in the logs."
            ],
            finished: ["Go bother Dyzes in Human Research. He's chill, but he definitely knows things he's not saying."]
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
        advancesStoryStage: true,
        reward: { type: 'item', id: 'Quest03' },
        dialogue: {
            offer: [
                "Man, I've seen your log activity. // You're piecing together 'The Incident', aren't you?",
                "But collecting logs isn't enough for me to get out of my lazy chair just yet.",
                "Chill out for now, man~"
            ],
            progress: ["Woah, man. You're a bit out of sync. Take a breather, hydrate, and maybe try focusing on the flow next time. No rush."],
            offer_completed: [
                "Man, I see you've gathered quite a bit of information.",
                "I can't let you expose the Director without a proper test of your tactical skill.",
                "It's time for me to step out of this chair!",
                "Let's see if your tactical vibe is strong enough!"
            ],
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
        advancesStoryStage: true,
        reward: { type: 'item', id: 'Quest02' },
        dialogue: {
            offer: [
                "...",
                "Don't you have work to do, Specialist?"
            ],
            progress: ["Dismissed. If you can't even handle a basic engagement, you have no business poking around the archives. // Go back to filing paperwork, Intern."],
            offer_completed: [
                "So. You found the Noodle Review. // You found the '27 security gap.",
                "You think a little chili sauce is enough to topple this Director?",
                "Fine! If you want the 'Origin', you'll have to go through me and my strongest Nitrophil first!",
                "I won't have my legacy tarnished by some spicy gossip!",
                "Prepare to be archived!"
            ],
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
        advancesStoryStage: true,
        reward: { type: 'resource', id: 'credits', amount: 5000 },
        dialogue: {
            offer: [
                "You have the Sauce. You have the Key. You have the Map.",
                "Find the Old Lab Room hidden in the Specimen Storage or Storage Bay.",
                "The Origin is waiting. End this farce."
            ],
            progress: ["Still searching for the hidden room? It's not on the main maps."],
            offer_completed: [
                "It's all over, isn't it? // You found the Origin Nitrophil... the truth is finally out in the light."
            ],
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
    0: { // LOBBY_START
        title: '[MAIN] PROTOCOL: INITIALIZATION',
        objective: 'Select your first Companion Cell.',
        narrative: 'Day 1 at Odd Labs. Honestly? This place is terrifyingly beautiful. I\'m supposed to \'pair\' with a sentient cell today. They\'re way bigger than the textbooks said, and they almost seem to be watching me back. Time to see which one wants to be my partner in this maze.'
    },
    1: { // CELL_CHOSEN
        title: '[MAIN] THE GATEKEEPER\'S VIBE',
        objective: 'Survive Jenzi\'s introductory diagnostic.',
        narrative: 'Jenzi’s got this refreshing, honest energy that actually makes me believe her when she says I’ve got potential. She isn’t just being nice—she’s testing me because she thinks I can handle it. If I can win this duel, I’ll know for sure that I’m not just another hire, but someone who actually belongs in this Lab.'
    },
    2: { // TUTORIAL_DONE
        title: '[MAIN] THE ATRIUM THRESHOLD',
        objective: 'Retrieve Log #001 from Specimen Storage.',
        narrative: 'Phew, what a test. The Atrium doors are still locked, and Jenzi is playing coy. She hinted that someone dropped a datapad near the specimen tanks in this wing. I need to find it.'
    },
    // Stage 3 (ATRIUM_UNLOCKED) is transitional
    4: { // ATRIUM_QUEST
        title: '[MAIN] ATRIUM ARCHIVE',
        objective: 'Archive 5 DataLogs and battle Jenzi again.',
        narrative: 'I\'ve been scrounging through the Atrium desks. Mention of \'Point Zero\' and \'Noodle Tuesday\' is everywhere. Jenzi is ready to spill the \'tea\' about the Incident, but only if I win this next duel. She says the Director\'s story is fishy... well, more like spicy.'
    },
    5: { // BOTANIC_UNLOCKED
        title: '[MAIN] PETALS AND SECRETS',
        objective: 'Defeat Lana to secure the Old Lab Key.',
        narrative: 'Scientist Lana is... intense. She treats her Cambihils like royalty and me like a budget virus. She’s definitely hiding something about the Director\'s \'private research.\' If I want that key to the restricted wing, I\'m going to have to out-sync her in a fight.'
    },
    6: { // LANA_DONE
        title: '[MAIN] OSMOTIC REVELATIONS',
        objective: 'Defeat Dyzes to retrieve the Old Data Stick.',
        narrative: 'Dyzes is the \'chillest\' guy here, but even he looks nervous when I mention the Old Lab. He says the truth is \'fluid.\' He’s got an old data stick that supposedly maps out a hidden sector. If I can stay in sync during his Lydrosome test, I might finally have a map to the truth.'
    },
    7: { // DYZES_DONE
        title: '[MAIN] THE EXECUTIVE TRUTH',
        objective: 'Confront Director Capsain in his suite.',
        narrative: 'I have the key. I have the map. Now I just have the Director. Capsain looks like he hasn\'t slept since 2027. He’s a frantic mess of high-level anxiety and corporate paranoia, acting more like a man guarding a haunted house than a scientific research facility. Something tells me he’s much closer to the edge than he lets on.'
    },
    8: { // CAPSAIN_DONE
        title: '[MAIN] THE SPICY ORIGIN',
        objective: 'Locate the Origin Nitrophil in the Old Lab.',
        narrative: 'Capsain is down. He gave me a bottle of \'Inferno Sauce\' and looked like his world was ending. The secret is in the basement—the Old Lab. I\'m going to find the \'Origin.\' If the legend is true, this whole facility was built on a beautiful, spicy accident.'
    }
};
