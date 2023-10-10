const Eris = require('eris')

module.exports = {
    name: 'info',
    description: 'Get user info',
    type: Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
    options: [
        {
            name: 'user',
            description: 'User to get info about',
            type: Eris.Constants.ApplicationCommandOptionTypes.USER,
            required: false
        }
    ],
    async run(client, interaction) {
        interaction.createMessage("Help command")
    }
}