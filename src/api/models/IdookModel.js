const mongoose = require("mongoose");

const senha = require("./utils/senha")

const adminSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true,
        },
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },

        senha
    },
    { timestamps: true }
);

const adminModel = mongoose.model("idook_admin", adminSchema);

module.exports = adminModel