const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hoatdongSchema = new Schema({
    noidung: String,
    diadiem: String, 
    ghichu: String, 
    doanvien: String,
    ngay: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }
},
{timestamps: true});

const Hoatdongs = mongoose.model('Hoatdongs', hoatdongSchema);

module.exports = Hoatdongs;