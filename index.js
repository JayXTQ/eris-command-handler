const fs = require('fs')
const Eris = require('eris')
require("dotenv").config()

const client = new Eris(process.env.TOKEN)
const commands = []

client.on('ready', () => {
    commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
    let loadedCommands = 0
    for (const command of commands) {
        try {
            const commandFile = require(`./commands/${command}`)
            if(!commandFile.options){
                client.createCommand({
                    name: commandFile.name,
                    description: commandFile.description,
                    type: commandFile.type
                })
            } else {
                client.createCommand({
                    name: commandFile.name,
                    description: commandFile.description,
                    type: commandFile.type,
                    options: commandFile.options
                })
            }
            loadedCommands++
        } catch(err) {
            console.log(err)
        }
    }
    console.log(`Loaded ${loadedCommands} commands, ready`)
})

client.on('interactionCreate', async (interaction) => {
    if (interaction instanceof Eris.CommandInteraction) {
        for (const command of commands) {
            try {
                const commandFile = require(`./commands/${command}`)
                if (commandFile.name === interaction.data.name) {
                    commandFile.run(client, interaction)
                }
            } catch(err) {
                console.log(err)
            }
        }
    }
})