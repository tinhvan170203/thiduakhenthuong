const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
var cookies = require("cookie-parser");
var bodyParser = require('body-parser')

app.use(cookies());


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
app.use(cors({
    // origin: "*",
    origin: ["http://localhost:5173", "http://localhost:3000", "http://192.168.1.10:5173"],
    credentials: true,
}));
// app.use(express.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb'}));
const port = process.env.port || 4000;


const notificationRoute = require('./routes/notification');
const roleRoute = require('./routes/role');
const bachamRoute = require('./routes/bacham');
const chucvuRoute = require('./routes/chucvu');
const authRoute = require('./routes/auth');
const khoiRoute = require('./routes/khoi');
const hoatdongRoute = require('./routes/hoatdong');
const capkhenthuongRoute = require('./routes/capkhenthuong');
const hinhthuckhenRoute = require('./routes/hinhthuckhen');
const donviRoute = require('./routes/donvi');
const doiRoute = require('./routes/doi');
const chidoanRoute = require('./routes/chidoan');
const canboRoute = require('./routes/canbo');
const khenthuongRoute = require('./routes/khenthuong');
const kiluatRoute = require('./routes/kiluat');
const thongkeRoute = require('./routes/thongke');

app.use('/notification', notificationRoute);
app.use('/khoi', khoiRoute);
app.use('/capkhen', capkhenthuongRoute);
app.use('/hinhthuckhen', hinhthuckhenRoute);
app.use('/don-vi', donviRoute);
app.use('/role', roleRoute);
app.use('/bac-ham', bachamRoute);
app.use('/chuc-vu', chucvuRoute);
app.use('/auth', authRoute);
app.use('/doi', doiRoute);
app.use('/chi-doan', chidoanRoute);
app.use('/can-bo', canboRoute);
app.use('/khen-thuong', khenthuongRoute);
app.use('/ki-luat', kiluatRoute);
app.use('/thong-ke', thongkeRoute);
app.use('/hoat-dong-doan', hoatdongRoute);

const path = require("path");
const basePath = '';


app.use('/upload', express.static(path.join(__dirname, '/upload')));
// //cấu hình chạy reactjs trên node server
app.use(basePath + "/", express.static(path.resolve(__dirname + "/dist")));

app.get("*", (request, response) => {
  response.sendFile(path.resolve(__dirname + "/dist/index.html"));
});

app.listen(port, () => {
    console.log('server running ', port)
});

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://vuvantinh121123:Tv170203@cluster0.rl9mtof.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if(err){
        console.log(err)
    }
    console.log('kết nối db thành công')
})
