const fs = require('fs')
const Eris = require('eris')
const { APIApplicationCommand } = require('discord-api-types/v10')
require("dotenv").config()

const client = new Eris(process.env.TOKEN)

/**
 * @typedef {Object} Command
 * @property {string} name
 * @property {string} description
 * @property {number} type
 * @property {Eris.CommandOption[]} [options]
 */


/**
 * @typedef {Object} CommandWithRun
 * @property {Function} run
 */

/**
 * @type {Record<string, Command | (Command & CommandWithRun)>}
 */
let commands = {}

client.on('ready', async () => {
    let commandNames = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
    /**
     * @type {Record<string, string>}
     */
    let commandToFile = {}
    /**
     * @type {Command[]}
     */
    let commands_ = []
    /**
     * @type {APIApplicationCommand[]}
     */
    const loadedCommands = await client.getCommands()
    for (const commandName of commandNames) {
        /**
         * @type {Command}
         */
        let command = JSON.parse(JSON.stringify(require(`./commands/${commandName}`)))
        commandToFile[command.name] = commandName
        /**
         * @type {(CommandWithRun & Command) | Command}
         */
        let loadedCommand = loadedCommands.find(cmd => cmd.name === command.name)
        if (loadedCommand) {
            const { name, description, options, type } = loadedCommand;
            loadedCommand = { name, description, options: options || undefined, type };
        }
        if(loadedCommand && loadedCommand === command) continue;
        if(!command.options) delete command.options;
        commands_.push(command)
    }
    if(commands_.length > 0) await client.bulkEditCommands(commands_)
    const commandsLoaded = await client.getCommands()
    commandsLoaded.forEach(command => {
        commands[command.name] = require(`./commands/${commandToFile[command.name]}`)
    })
    console.log(`Loaded ${commandsLoaded.length} commands, ready`)
})

client.on('interactionCreate', async (interaction) => {
    if (interaction instanceof Eris.CommandInteraction) {
        try{
            commands[interaction.data.name].run(client, interaction)
        } catch(e) {
            interaction.createMessage({
                content: `Error`,
                ephemeral: true
            })
        }
    }
})

client.connect()