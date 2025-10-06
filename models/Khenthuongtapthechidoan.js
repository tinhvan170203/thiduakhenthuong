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
    nhomchidoanduockhenthuong: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chidoans"
    }]
},
{timestamps: true});

const KhenthuongtaptheChidoan = mongoose.model('KhenthuongtaptheChidoan', khenthuongtaptheSchema);

module.exports = KhenthuongtaptheChidoan;