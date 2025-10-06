const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    tentaikhoan: {
        type: String, 
        unique: true
    },
    matkhau: String,
    thutu: Number,
    quantrinhomdonvi: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donvis"
    }],
    quantrinhomchidoan: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chidoans"
    }],
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Roles"
    }],
    trangthai: String // 
});

const UsersDoanvien = mongoose.model('UsersDoanvien', userSchema);

module.exports = UsersDoanvien;