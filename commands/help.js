const Eris = require('eris')

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    type: Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
    async run(client, interaction) {
        interaction.createMessage("Help command")
    }
}