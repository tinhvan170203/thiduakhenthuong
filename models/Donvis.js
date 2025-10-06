const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const donviSchema = new Schema({
    tendonvi: String,
    kyhieu: String,
    thutu: Number,
    status: Boolean,
    trangthai: Boolean,
    khoi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Khois"
    }
},
{timestamps: true});

const Donvis = mongoose.model('Donvis', donviSchema);

module.exports = Donvis;