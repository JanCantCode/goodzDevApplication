const token = require("./config.json").token
const { channel } = require("diagnostics_channel")
const Discord = require("discord.js")
const fs = require("fs")
let userDataBase = JSON.parse(fs.readFileSync("./userDataBase.json"))
const bot = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MEMBERS
    ]
})
bot.on("messageCreate", (message) => {
    userDataBase = JSON.parse(fs.readFileSync("./userDataBase.json"))
    console.log(message.content)
    if (message.author.bot) return
    let args = message.content.split(" ")
    if (args[0] !== ".friend") return
    if (message.mentions.users.first().id = message.author.id) {
        message.channel.send("Wie leid es mir auch tut, du kannst dich selber leider nicht als Freund hinzufügen D:")
        return
    }
    if (userDataBase[message.author.id].friendswith.includes(message.mentions.users.first().id)) {
        message.channel.send("Du hast " + message.mentions.users.first()+ "bereits auf deiner Freundesliste!")
    }
    if (!userDataBase[args[1]]) {
        userDataBase[args[1]] = {
            "friends": 1,
            "friendswith": [message.author.id]
        }
    }
    if (userDataBase[message.author.id]) {
        if (userDataBase[message.author.id].friends >= 1) {
            message.channel.send("Du hast leider schon zuviele freunde D:")
        } else {
            userDataBase[message.author.id].friends = userDataBase[message.author.id].friends+ 1
            userDataBase[message.author.id].friendswith.push(message.mentions.users.first().id)
            userDataBase[args[1]].friendswith.push(message.author.id)
        }
    } else {
        userDataBase[message.author.id] = {
            "friends": 1,
            "friendswith": [message.mentions.users.first().id]
        }
    }
    fs.writeFileSync("userDataBase.json", JSON.stringify(userDataBase))
})






console.log(token)
bot.login(token)