const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const anhSchema = new Schema({
    url: String,
    thutu: Number,
    noidung: String,
    status: Boolean
},{timestamps: true});

const Anhs = mongoose.model('Anhs', anhSchema);

module.exports = Anhs;