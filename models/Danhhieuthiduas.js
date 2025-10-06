const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const danhhieuthiduaSchema = new Schema({
    nam: Number,
    noidung: String,
    tapthe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }
},
{timestamps: true});

const Danhhieuthiduas = mongoose.model('Danhhieuthiduas', danhhieuthiduaSchema);

module.exports = Danhhieuthiduas;