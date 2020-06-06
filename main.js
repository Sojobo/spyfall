const Discord = require("discord.js");
const config = require("./core/config.js");

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);
db.defaults({
    rooms: [],
    users: [],
    ranks: []
}).write();

let guild;

const spyBot = new Discord.Client();
spyBot.on("ready", () => {
    console.log(`Logged in as ${spyBot.user.tag}!`);
    spyBot.user.setPresence({
        game: {
            name: "you",
            type: "WATCHING"
        },
        status: "online"
    });

    guild = spyBot.guilds.get("679326539178967103"); // SpaceTurtles
});

spyBot.on("message", message => {
    try {
        if (message.author.bot) {
            return; // Ignore messages by bots
        }

        const mentioned = message.isMemberMentioned(spyBot.user);

        // Are we a known user? If not, cache us
        let thisUser = db.get("users")
            .find({ id: message.member.id })
            .value();

        if (typeof thisUser === "undefined" && message.guild === guild) {
            thisUser = {
                name: message.author.username
            };

            db.get("users")
                .push(thisUser)
                .last()
                .assign({ id: message.member.id })
                .write();
        }

        if (typeof thisUser !== "undefined") {
            handleMessageForAdmiral(message.channel.id, message, thisUser);
        }

        if (mentioned && /channel/i.test(message.content)) {
            message.reply(message.channel.id);
        }
    } catch (err) {
        console.log(err);
        message.delete();
    }
});

spyBot.login(config.main.botToken);

function handleMessageForAdmiral(roomid, message, thisUser) {
    switch (message) {
        // default:
        //     if (message.guild !== guild && Math.floor(Math.random() * 20) === 1) {
        //         message.reply("What is this strange place?");
        //     }
        //     break;
    }
}

// captainShark.channels.get(message.channel.id).send("hello, spyBot made me do it");
// captainShark.users.get(message.author.id).send("hello, spyBot made me do it");
