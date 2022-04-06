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
    if (message.author.bot) return
    let args = message.content.split(" ")
    if (args[0] !== ".friend") return
    let maxFriends = 0
    if (message.member.roles.cache.some(role => role.name === 'sup')) {
        maxFriends = 2
    } else {
        if (message.member.roles.cache.some(role => role.name === 'mod')) {
            maxFriends = 3
        } else {
            if (message.member.roles.cache.some(role => role.name === 'sernior-mod')) maxFriends = 4
        }
    }
    if (message.mentions.users.first() == undefined) {
        message.channel.send("Du solltest schon eine existente Person als freund hinzufügen i guess, ```" + args[1] + "``` ist entweder nicht auf dem Server, oder kein realer Nutzer.")
        return
    }
    if (!userDataBase[message.mentions.users.first().id]) {
        userDataBase[message.mentions.users.first().id] = {
            "friends": 0,
            "friendswith": []
        }
    }
    if (userDataBase[message.author.id]) {
        if (message.mentions.users.first().id == message.author.id) {
            message.channel.send("Wie leid es mir auch tut, du kannst dich selber leider nicht als Freund hinzufügen D:")
            return
        }
        if (userDataBase[message.author.id].friendswith.includes(message.mentions.users.first().id)) {
            message.channel.send("Du hast ```" + message.mentions.users.first().username + "``` bereits auf deiner Freundesliste!")
            return
        }
        if (userDataBase[message.author.id].friends >= maxFriends) {
            message.channel.send("Du hast leider dein limit von ```" +maxFriends+ "``` Freunden überschritten")
            return
        } else {
            userDataBase[message.author.id].friends = userDataBase[message.author.id].friends+ 1
            userDataBase[message.author.id].friendswith.push(message.mentions.users.first().id)
            userDataBase[message.mentions.users.first().id].friendswith.push(message.author.id)
            userDataBase[message.mentions.users.first().id].friends += 1
        }
    } else {
        userDataBase[message.author.id] = {
            "friends": 1,
            "friendswith": [message.mentions.users.first().id]
        }
        userDataBase[message.mentions.users.first().id].friends += 1
        userDataBase[message.mentions.users.first().id].friendswith.push(message.author.id)
    }
    message.channel.send("Du hast ```"+message.mentions.users.first().username+"``` als deinen freund hinzugefügt!")
    fs.writeFileSync("userDataBase.json", JSON.stringify(userDataBase))
})






bot.login(token)
