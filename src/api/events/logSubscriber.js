const LogModel = require('../models/Logs')
const log = require('../log/index')

const persisteLog = async (type, message, detalhes) => {
    try {
        const salvarLog = new LogModel({ type, message, detalhes })
        await salvarLog.save()
    } catch (error) {
        
    }
}

module.exports = (event) => {
    event.on("log", (type, message, detalhes) => {
        if (type=="ERROR") {
            persisteLog(type, message, detalhes);
        }
    })
}