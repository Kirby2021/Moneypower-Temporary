const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'Channelinfo',
	description: 'Information about specify channel',
	aliases: ['channelinfo','ci',"channel"],
	usage: `Channelinfo <channel/id/name>`,
	cooldown: 5,
	run: async(client, message, args) => {
  
     message.content.toLowerCase()
         let nsfwV = message.channel.nsfw ? 'Yes' : 'No';
         let today = new Date().toISOString().slice(0, 10)
        let channel = message.mentions.channels.first() || client.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(r => r.name.toLowerCase() === args.join(' ').toLocaleLowerCase());
        if (!channel) return message.inlineReply("Please mention a Channel or ID");

        let channelembed = new MessageEmbed()
            .setTitle(`Channel Information for ${channel.name}`)
            .setThumbnail(message.guild.iconURL())
            .addField("**Channel NSFW**", nsfwV || 'No Nsfw requiring')
            .addField("**Channel ID**", channel.id)
            .addField("**Channel Type**", channel.type)
            .addField("**Channel Limit**", channel.userLimit || 'No Limit require')
            .addField("**Channel Bitrate**", channel.bitrate || 'No Bitrate require')
            .addField("**Channel Description**", `${channel.topic || "No Description"}`)
            .addField("**Channel Created Date**", channel.createdAt)
            .setColor("GREEN")
        message.channel.send(channelembed);
      
    
  }
} 
