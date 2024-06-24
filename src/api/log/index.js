const chalk = require('chalk')

class Console {
    static warn(...args) {
        console.log(chalk.yellow("[AVISO]"), chalk.yellow(...args))
    }
    static error(...args) {
        console.log("[ERROR]", chalk.red(...args))
    }
    static sucess(...args) {
        console.log("[INFO]", chalk.green(...args))
    }
    static info(...args) {
        console.log("[INFO]", ...args)
    }
}

class DisableConsole  {
    static warn(...args) {
        
    }
    static error(...args) {
        
    }
    static sucess(...args) {
        
    }
    static info(...args) {
        
    }
}

const strategyLogs = () => {
    const NODE_ENV =  process.env.NODE_ENV
    if (NODE_ENV== "production") return DisableConsole
    if (NODE_ENV== "test") return DisableConsole
    return Console
}

module.exports = strategyLogs()