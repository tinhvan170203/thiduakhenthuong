const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const danhhieuthiduaCapdoiSchema = new Schema({
    nam: Number,
    noidung: String,
    tapthe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dois"
    }
},
{timestamps: true});

const DanhhieuthiduasCapdois = mongoose.model('DanhhieuthiduasCapdois', danhhieuthiduaCapdoiSchema);

module.exports = DanhhieuthiduasCapdois;