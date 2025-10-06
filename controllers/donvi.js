const Donvis = require("../models/Donvis");
const Canbos = require("../models/Canbo");
const Chidoans = require("../models/Chidoans");
const Khenthuongtapthe = require("../models/Khenthuongtapthe");
const Dois = require("../models/Dois");
const Users = require("../models/Users");
const HistoriesSystem = require("../models/HistoriesSystem");
module.exports = {
  getDonvis: async (req, res) => {
    try {
      let donvis = await Donvis.find().sort({ thutu: 1 }).populate('khoi');
      res.status(200).json(donvis);
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra khi lấy danh sách đơn vị. Vui lòng liên hệ quản trị viên",
      });
    }
  },
  
  addDonvi: async (req, res) => {
    let {tendonvi, kyhieu, khoi, thutu, status,trangthai} = req.body;
    khoi = khoi.value;
    try {
        let donvi = new Donvis({tendonvi, kyhieu, khoi, thutu, status, trangthai});
        await donvi.save();

        let donvis = await Donvis.find().sort({thutu: 1}).populate('khoi')
        res.status(200).json({donvis, message: "Thêm mới đơn vị thành công!"})
    } catch (error) {
        console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra khi thêm mới đơn vị. Vui lòng liên hệ quản trị viên",
      });
    }
  },

  updateDonvi: async (req, res) => {
    let {tendonvi, kyhieu, khoi, thutu, status, trangthai} = req.body;
    khoi = khoi.value;
    let id = req.params.id;
    try {
      await Donvis.findByIdAndUpdate(id,{
        tendonvi, kyhieu, khoi, thutu, status, trangthai
      });

      let donvis = await Donvis.find().sort({thutu: 1}).populate('khoi')

      res.status(200).json({donvis, message: "Update đơn vị thành công!"})
  } catch (error) {
      console.log("lỗi: ", error.message);
    res.status(401).json({
      status: "failed",
      message: "Có lỗi xảy ra khi update đơn vị. Vui lòng liên hệ quản trị viên",
    });
  }
  },

  deleteDonvi:  async (req, res) => {
    let id = req.params.id;
    try {
      let checked = await Canbos.findOne({
        "donvi.donvi" : id
      });

      if(checked!== null){
        const error = new Error('Thao tác xóa thất bại do có đoàn viên đang thuộc đơn vị bạn muốn xóa. Vui lòng kiểm tra lại hành động xóa');
        error.status = 401;
        throw error;
      };

      let checked1 = await Chidoans.findOne({
        "nhomdonvithuocchidoan" : id
      });

      if(checked1!== null){
        const error = new Error('Thao tác xóa thất bại do đơn vị đang thuộc 1 chi đoàn. Vui lòng kiểm tra lại hành động xóa');
        error.status = 401;
        throw error;
      };

      let checked2 = await Canbos.findOne({
        "donvidiaphuongkhac" : id
      });

      if(checked2!== null){
        const error = new Error('Thao tác xóa thất bại do có cán bộ đã chuyển công tác đến đơn vị, địa phương khác ngoài tỉnh. Vui lòng kiểm tra lại hành động xóa');
        error.status = 401;
        throw error;
      };

      //xóa tất cả các đội thuộc đơn vị
      await Dois.deleteMany({
        donvi: id
      });

      // xóa tất cả quản trị nhớm đơn vị chưa đơn vị đó trong user
      await Users.updateMany({$pull: { quantrinhomdonvi: id}});

      await Donvis.findByIdAndDelete(id);
      let donvis = await Donvis.find().sort({thutu: 1}).populate('khoi');

      res.status(200).json({donvis, message: "Xóa đơn vị thành công!"})
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: error.message,
      });
    }
  }

};
