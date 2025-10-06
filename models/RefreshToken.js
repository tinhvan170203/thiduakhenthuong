const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const refreshSchema = new Schema({
    refreshToken: {
        type: String
    }
},{ timestamps: true });


const RefreshTokens = mongoose.model('RefreshTokens', refreshSchema);

module.exports = RefreshTokens;