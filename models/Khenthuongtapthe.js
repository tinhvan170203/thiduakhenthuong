const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const khenthuongtaptheSchema = new Schema({
    soQD: String,
    ngayky: String,
    nguoiky: String,
    capkhen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Capkhenthuongs"
    },
    hinhthuc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hinhthuckhens"
    },
    noidung: String,
    tapthe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }
},
{timestamps: true});

const Khenthuongtapthe = mongoose.model('Khenthuongtapthe', khenthuongtaptheSchema);

module.exports = Khenthuongtapthe;