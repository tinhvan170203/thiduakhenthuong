const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// đội, tổ công tác thuộc phòng, xã mà ở đây đơn vị sẽ tương đương với user có quyền vai trò quản trị thông thường
const doiSchema = new Schema({
    tendoi: String,
    thutu: Number,
    status: Boolean,
    donvi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    donviString: String
},
{timestamps: true});

const Dois = mongoose.model('Dois', doiSchema);

module.exports = Dois;