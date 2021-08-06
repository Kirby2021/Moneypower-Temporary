const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  name: "Transfer",
  aliases: ["transfer","trans","trf"],
  description: "Transfer your channel to user mention",
  usage: "Transfer <mention>",
  ownerOnly: false,
  myServerOnly: false,
  guildOnly: false,
  cooldown: 2,
	run: async (client, message, args) => {


let channel = message.member.voice.channel; 
if (!channel)return message.channel.send({
                        embed: {
                            color: "RED",
                            description :`Setting channel on your own channel`
                        }
   
                   })
                    let user = message.mentions.members.first()
 if(!user) throw message.inlineReply("⚠ - Please mention user to transfer the overwrite permission")
                   
if (!message.member.permissionsIn(channel).has('MANAGE_CHANNELS'))
  return message.inlineReply('⚠ - The channel is owned');

if (!message.guild.me.permissionsIn(channel).has('MANAGE_CHANNELS'))
  return message.inlineReply('⚠ - I dont have authority to manage'); 


channel.permissionOverwrites.get(message.member.id).delete()
channel.updateOverwrite(user.id, {
//PERMISSION FOR CHANNEL AUTHOR
             STREAM: true,
             CONNECT: true,
             USE_VAD: true,
             MANAGE_CHANNELS: true,
             SPEAK: true,
               })      


let ikan = new MessageEmbed()
  .setTitle("Authority Update")
  .addField("Transfer Rights",`
\`⚠\` Previous Owner : <@${message.member.id}>
\`✅\` Current Author : <@${user.id}>
  `)
  .setFooter(`© ${message.guild.name} 2021`)
  .setColor("GREEN")
throw  message.inlineReply(ikan)

  }
}
//previous owner
 
