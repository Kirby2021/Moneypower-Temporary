const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'Help',
	description: 'List all of my commands or info about a specific command.',
  guildOnly: false,
  myServerOnly: false,
	aliases: ['commands', 'help','h'],
	usage: `help <command_name>`,
	cooldown: 5,
	run: async (client, message, args) => {

		const data = [];
		const { commands } = message.client;

		if (!args.length) {
     let helpEmbed1 = new MessageEmbed()

		.setAuthor(client.user.username)
    .setDescription("Commands State\nIf you want to get information about our commands, you can try to find with `Help_Cmdname`. For example `Help Limit`.")
    .setThumbnail(client.user.displayAvatarURL())
    .setFooter("Support by Fan.")
    .addFields(
                
                {
                    name: "`🔒` Voice Manager",
                    value: "`Name` `Limit` `Channelinfo`",
                    inline: false
                }
           
    )
    .setColor("PURPLE")
    .setFooter(`${client.user.username} Created by ${message.author.username} with Logic`)
    
    message.inlineReply(helpEmbed1)
		}
if(!args[0]){
  return false;
} 
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		data.push(`• **Name:** ${command.name}`);

		if (command.aliases) data.push(`• **Aliases:** ${command.aliases.join(', ')}`);
    
    
		if (command.description) data.push(`• **Description:** ${command.description}`);
    
    
		if (command.usage) data.push(`• **Usage:** ${command.usage}`);
  
    if(command.ownerOnly) {
      data.push(`• **Everyone:** No`) 
    } else {
data.push(`• **Everyone:** Yes`)
    }
    
    if(command.myServerOnly){ 
    data.push(`• **Specific Server **: Yes`)
} else {
  data.push(`• **Specific Server**: No`)
}
    
if (command.guildOnly){
  data.push(`• **Specific Guild**: Yes`)
} else {
  data.push(`• **Specific Guild**: No`)
}
 		data.push(`• **Cooldown:** ${command.cooldown || 3} second(s)`);
    let kid = new MessageEmbed()
    .setTitle(`About ${command.name}`)
    .setColor('GREEN')
    .setDescription(data, { split: true })
    const msg = await message.inlineReply(kid)
	},
};
