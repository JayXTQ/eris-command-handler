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
        let command = require(`./commands/${commandName}`)
        command = JSON.parse(JSON.stringify(commandFile))
        if(!command.options) command.options = null;
        let loadedCommand = loadedCommands.find(command => command.name === commandFile.name)
        if(loadedCommand) loadedCommand = {
            name: loadedCommand.name,
            description: loadedCommand.description,
            options: loadedCommand.options || null,
            type: loadedCommand.type
        }
        if(loadedCommand && loadedCommand === command) continue;
        if(commands.options === null) delete commands.options;
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