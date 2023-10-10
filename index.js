const fs = require('fs')
const Eris = require('eris')
const { APIApplicationCommand } = require('discord-api-types/v10')
require("dotenv").config()

const client = new Eris(process.env.TOKEN)
/**
 * @type {string[]}
 */
let commandNames = []

client.on('ready', async () => {
    /**
     * @typedef {Object} Command
     * @property {string} name
     * @property {string} description
     * @property {number} type
     * @property {Eris.CommandOption[]} [options]
     */
    commandNames = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
    /**
     * @type {Command[]}
     */
    let commands = []
    /**
     * @type {APIApplicationCommand[]}
     */
    const loadedCommands = await client.getCommands()
    for (const commandName of commandNames) {
        /**
         * @type {Command}
         */
        let command = JSON.parse(JSON.stringify(require(`./commands/${commandName}`)))
        /**
         * @typedef {Object} CommandWithRun
         * @property {Function} run
         */

        /**
         * @type {(CommandWithRun & Command) | Command}
         */
        let loadedCommand = loadedCommands.find(command => command.name === commandFile.name)
        if (loadedCommand) {
            const { name, description, options, type } = loadedCommand;
            loadedCommand = { name, description, options: options || undefined, type };
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