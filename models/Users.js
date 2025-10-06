const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    tentaikhoan: {
        type: String, 
        unique: true
    },
    madonvi: {
        type: String, 
        unique: true
    },
    tenhienthi: String,
    matkhau: String,
    thutu: Number,
    vaitro: String, // Admin hay co quyen theo doi, SuperAdmin quyen toan he thoong
    captaikhoan: String, // cấp Phòng, cấp Xã
    khoi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Khois"
    },
    trangthai: Boolean // 
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;