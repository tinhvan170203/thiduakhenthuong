const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chucvuSchema = new Schema({
    chucvu: String,
    thutu: Number,
},{timestamps: true});

const Chucvus = mongoose.model('Chucvus', chucvuSchema);

module.exports = Chucvus;