const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const capkhenthuongSchema = new Schema({
    capkhen: String,
    thutu: Number,
    status: Boolean
},{timestamps: true});

const Capkhenthuongs = mongoose.model('Capkhenthuongs', capkhenthuongSchema);

module.exports = Capkhenthuongs;