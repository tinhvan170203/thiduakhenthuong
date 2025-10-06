const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const kiluatcanhanSchema = new Schema({
    soQD: String,
    ngayky: String,
    nguoiky: String,
    hinhthuc: String,
    noidung: String,
    canhanbikiluat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Canbos"
    }
},
{timestamps: true});

const Kiluatcanhan = mongoose.model('Kiluatcanhan', kiluatcanhanSchema);

module.exports = Kiluatcanhan;