const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const khenthuongcanhanSchema = new Schema({
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
    canhanduockhenthuong: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Canbos"
    }
},
{timestamps: true});

const Khenthuongcanhan = mongoose.model('Khenthuongcanhan', khenthuongcanhanSchema);

module.exports = Khenthuongcanhan;