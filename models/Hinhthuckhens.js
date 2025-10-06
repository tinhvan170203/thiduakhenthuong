const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hinhthuckhenSchema = new Schema({
    hinhthuckhen: String,
    thutu: Number,
    status: Boolean
},{timestamps: true});

const Hinhthuckhens = mongoose.model('Hinhthuckhens', hinhthuckhenSchema);

module.exports = Hinhthuckhens;