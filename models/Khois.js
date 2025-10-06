const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const khoiSchema = new Schema({
    tenkhoi: String,
    thutu: Number,
    status: Boolean,
    thuocCAT: Boolean
},{timestamps: true});

const Khois = mongoose.model('Khois', khoiSchema);

module.exports = Khois;