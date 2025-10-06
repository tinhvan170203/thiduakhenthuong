const mongoose = require('mongoose');
const moment = require('moment-timezone');
const Schema = mongoose.Schema;

const systemSchema = new Schema({
    action: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
},{timestamps: true});

const HistoriesSystem = mongoose.model('HistoriesSystem', systemSchema);

module.exports = HistoriesSystem;