const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const canboSchema = new Schema({
  hoten: {
    type: String,
  },
  ngaysinh: String,
  gioitinh: String,
  dangvien: Boolean,
  doanvien: Boolean,
  ngayvaodang: String,
  nghihuu: {
    type: Boolean,
    default: false
  },
  ngaynghihuu: {
    type: String,
    default: "0000-01-01"
  },
  trangthai: String, //active, delete muc 1 ddang hoat dong, xoa boi nguoi dung chi admin moi co quyen xoa hoan toan
  truongthanhdoan: Boolean,
  ngaytruongthanhdoan: String,
  chuyencongtacngoaitinh: Boolean,
  donvidiaphuongkhac: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Khois",
  },
  thutu: Number,
  ngaychuyendonvidiaphuongkhac: String,
  yeucauChuyencongtac: {
    trangthai: String, // Yêu cầu, Từ chối, Hoàn thành
    init: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    ghichu: String,
    ghichu_target: String,
    time: Date
  },
  bacham: [
    {
      bacham: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bachams",
      },
      tungay: String,
      timeNumber: Number,
      bachamString: String,
      ghichu: String,
      date: { type: Date, default: Date.now },
    },
  ],
  chucvu: [
    {
      chucvu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chucvus",
      },
      tungay: String,
      ghichu: String,
      timeNumber: Number,
      chucvuString: String,
      date: { type: Date, default: Date.now },
    },
  ],
  donvi: [
    {
      donvi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dois",
      },
      donviString: String,
      tungay: String,
      timeNumber: Number,
      ghichu: String,
      date: { type: Date, default: Date.now },
    },
  ],
  thiduathang: [{
    thoigian: String, //2023-01-15
    result: String, //blue, red, yellow, null
    ghichu: String
  }],
  thiduanam: [{
    thoigian: String, //2023
    result: String, //
    ghichu: String
  }],
  xeploaidangvien: [{
    thoigian: String, //2023
    result: String, //
    ghichu: String
  }],
  thiduathangdoanvien: [{
    thoigian: String, //2023-01-15
    result: String, //blue, red, yellow, null
    ghichu: String
  }],
  thiduanamdoanvien: [{
    thoigian: String, //2023
    result: String, //
    ghichu: String
  }],
  thiduathangphunu: [{
    thoigian: String, //2023-01-15
    result: String, //blue, red, yellow, null
    ghichu: String
  }],
  thiduanamphunu: [{
    thoigian: String, //2023
    result: String, //
    ghichu: String
  }],
});

const Canbos = mongoose.model("Canbos", canboSchema);

module.exports = Canbos;
