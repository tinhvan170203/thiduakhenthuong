const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rolesSchema = new Schema({
    tennhom: String,
    mota: String,
    thutu: Number,
    roles: [String],
    status: Boolean
},{timestamps: true});

const Roles = mongoose.model('Roles', rolesSchema);

module.exports = Roles;