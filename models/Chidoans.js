const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chidoanSchema = new Schema({
    tenchidoan: String,
    thutu: Number,
    status: Boolean,
    nhomdonvithuocchidoan: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donvis"
    }]
},
{timestamps: true});

const Chidoans = mongoose.model('Chidoans', chidoanSchema);

module.exports = Chidoans;