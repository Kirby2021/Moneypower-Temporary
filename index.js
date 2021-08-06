require('dotenv').config;
const Discord = require('discord.js')
const { Collection, MessageEmbed } = require('discord.js')
const { Client } = require('discord.js')
const fs = require("fs")
const client = new Discord.Client();
const cooldowns = new Discord.Collection()
const CatLoggr = require("cat-loggr")
const { PREFIX } = require("./config.json")
client.login(process.env.TOKEN)

client.on(`ready`, (message) => {
  try {
  client.logger.init(`✅ Logged as ${client.user.username}`)
  } catch(e) {
  console.log(e)
  }
});

//REPLYING ON MENTION
client.on('message', async message => {
   let embeda = new MessageEmbed()
    .setColor("PURPLE")
    .setAuthor(message.author.username, message.author.displayAvatarURL({format: 'png', dynamic: true})+"?size=2048")
    .setDescription(`Prefix : ${PREFIX} `)
    if (message.content === `<@!${client.user.id}>` || message.content === `<@${client.user.id}>`)
    return message.inlineReply(embeda); 
});

//DISCORD BOT STATUS STREAMING
client.on("ready", (message => {
  client.user.setStatus("ONLINE");
 setInterval(() => {
 
   const status = [        
     `MoneyPower TempVoice`,        
     ];
   let random = Math.floor(Math.random() * status.length);
   client.user.setActivity({
     url: "https://www.youtube.com/watch?v=Y2tpwVqL1R0",
     name: status[random],
     type: "STREAMING",
   });
 }, 3000)
}));

//COMMAND HANDLER AND LOADER
fs.readdir("./Commands/VoiceManage/", (_err, files) => {
    const jsFiles = files.filter(f => f.split(".").pop() === "js")
    if (jsFiles.length <= 0) return client.logger.error("I can't find the command!")
    jsFiles.forEach((file) => {
        const cmd = require(`./Commands/VoiceManage/${file}`)
        client.logger.init(`✅ Loaded ${file}`)
        client.commands.set(cmd.name, cmd)
        if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name))
    })
})


//COMMAND HANDLER
client.on("message", async message => {
    if (!message.guild || message.author.bot || message.channel.type === "dm") return
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`)
    if (!prefixRegex.test(message.content)) return

    const [, matchedPrefix] = message.content.match(prefixRegex)

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()

    const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command) return

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection())
    }
    const now = Date.now()
    const timestamps = cooldowns.get(command.name)
    const cooldownAmount = (command.cooldown || 1) * 1000

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000
            return message.inlineReply(
                `\`${command.name}\` The command is ${timeLeft.toFixed(1)} You can use it again in seconds!`
            )
        }
    }
    timestamps.set(message.author.id, now)
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

    try {
        command.run(client, message, args)
    } catch (error) {
        client.logger.error(error)
        message.reply(`An error has occurred.\n${error}`).catch(client.logger.error)
    }
})

//SIMPLE JOIN TO CREATE DISCORD V12
client.on('voiceStateUpdate', async (oldState, newState) => {
     const user = await client.users.fetch(newState.id);
     const member = newState.guild.member(user)

    if(newState.channelID === process.env.VoiceChannelID) {
        newState.guild.channels.create(`💬 ${user.username}`, { type: "voice", parent: process.env.CategoryID })
            .then(async (set) => {
               await set.lockPermissions().then(add => add.updateOverwrite(newState.id, {
//PERMISSION FOR CHANNEL AUTHOR
             STREAM: true,
             CONNECT: true,
             USE_VAD: true,
             MANAGE_CHANNELS: true,
             SPEAK: true,
               })
               )          
                return newState.setChannel(newState.guild.channels.cache.get(set.id))
            })
    }
 //FILTER THE CHANNEL IF THE SIZE HAS 0   
    if(oldState.channel) {
        let filtered = (ch) =>
            (ch.parentID === process.env.CategoryID)
            && (ch.id !== process.env.VoiceChannelID)
            && (oldState.channelID == ch.id)
            && (oldState.channel.members.size === 0);
        
        return oldState.guild.channels.cache
            .filter(filtered)
            .forEach((ch) => ch.delete());
    }
});

//CLIENT LOGGER
client.on("warn", (info) => client.logger.warn(info))
client.on("error", (error) => client.logger.error(error))
client.commands = new Discord.Collection()
client.prefix = PREFIX
client.aliases = new Discord.Collection()
client.logger = new CatLoggr()
require("./InlineMessage");
