const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bachamSchema = new Schema({
    bacham: String,
    thutu: Number,
    nienhan: Number
},{timestamps: true});

const Bachams = mongoose.model('Bachams', bachamSchema);

module.exports = Bachams;