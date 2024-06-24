const mongoose = require("mongoose");

const LogTypes = ["INFO", "ERROR", "WARN", "SUCCESS"]

const logSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: {
              values: LogTypes,
              message: '{VALUE} não suportado, valores validos: ' + LogTypes.join(' | ') 
            }
          },
        _id: {
            type:  mongoose.Schema.Types.ObjectId,
            default: mongoose.Types.ObjectId,
            required: true
        },
        message : String,
        detalhes: String
    },
    { timestamps: true } 
);

const logModel = mongoose.model("logs", logSchema);

logModel.createIndexes()

module.exports = logModel