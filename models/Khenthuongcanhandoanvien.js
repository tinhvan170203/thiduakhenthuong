const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const khenthuongcanhanSchema = new Schema({
    soQD: String,
    ngayky: String,
    nguoiky: String,
    capkhen: String,
    hinhthuc: String,
    noidung: String,
    canhanduockhenthuong: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Canbos"
    }
},
{timestamps: true});

const KhenthuongcanhanDoanvien = mongoose.model('KhenthuongcanhanDoanvien', khenthuongcanhanSchema);

module.exports = KhenthuongcanhanDoanvien;