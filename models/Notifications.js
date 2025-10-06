const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    thongbao: String,
    thutu: Number,
    status: Boolean
},{timestamps: true});

const Notifications = mongoose.model('Notifications', notificationSchema);

module.exports = Notifications;