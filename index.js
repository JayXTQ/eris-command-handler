const fs = require('fs')
const Eris = require('eris')
require("dotenv").config()

const client = new Eris(process.env.TOKEN)
let commandNames = []

client.on('ready', async () => {
    commandNames = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
    let commands = []
    const loadedCommands = await client.getCommands()
    for (const commandName of commandNames) {
        const commandFile = require(`./commands/${commandName}`)
        const loadedCommand = loadedCommands.find(command => command.name === commandFile.name)
        let command = {
            name: commandFile.name,
            description: commandFile.description,
            type: commandFile.type
        }
        if(commandFile.options){
            command.options = commandFile.options
        }
        if(loadedCommand && loadedCommand.description === command.description && loadedCommand.options === command.options && loadedCommand.type === command.type) continue;
        commands.push(command)
    }
    if(commands.length > 0) await client.bulkEditCommands(commands)
    console.log(`Loaded ${(await client.getCommands()).length} commands, ready`)
})

client.on('interactionCreate', async (interaction) => {
    if (interaction instanceof Eris.CommandInteraction) {
        for (const command of commands) {
            try {
                const commandFile = require(`./commands/${command}`)
                if (commandFile.name === interaction.data.name) {
                    await commandFile.run(client, interaction)
                }
            } catch(err) {
                console.log(err)
            }
        }
    }
})

client.connect()