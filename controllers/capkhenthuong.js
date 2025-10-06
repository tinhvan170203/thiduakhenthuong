const Capkhenthuongs = require("../models/Capkhenthuongs");
const Khenthuongcanhan = require("../models/Khenthuongcanhan");
const Khenthuongtapthe = require("../models/Khenthuongtapthe");
const KhenthuongtaptheCapdoi = require("../models/Khenthuongtapthecapdoi");
const HistoriesSystem = require("../models/HistoriesSystem");
module.exports = {
  getCapkhenthuongs: async (req, res) => {
    try {
      let khois = await Capkhenthuongs.find().sort({ thutu: 1 });
      res.status(200).json(khois);
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên",
      });
    }
  },

  addCapkhenthuong: async (req, res) => {
    let { capkhen, thutu, status } = req.body;
    try {
      let khoi = new Capkhenthuongs({ capkhen, thutu, status });
      await khoi.save();

      let khois = await Capkhenthuongs.find().sort({ thutu: 1 })
      res.status(200).json({ khois, message: "Thêm mới thành công!" })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra khi thêm mới. Vui lòng liên hệ quản trị viên",
      });
    }
  },

  updateCapkhenthuong: async (req, res) => {
    let { capkhen, thutu, status } = req.body;

    let id = req.params.id;
    try {
      await Capkhenthuongs.findByIdAndUpdate(id, {
        capkhen, thutu, status
      });

      let khois = await Capkhenthuongs.find().sort({ thutu: 1 })

      res.status(200).json({ khois, message: "Update thành công!" })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra khi update. Vui lòng liên hệ quản trị viên",
      });
    }
  },

  deleteCapkhenthuong: async (req, res) => {
    let id = req.params.id;
    try {
        let checked = await Khenthuongtapthe.findOne({
          capkhen : id
      });

      if(checked!== null){
        const error = new Error('Thao tác xóa thất bại do có khen thưởng chưa dữ liệu liên quan đến cập khen thưởng muốn xóa. Vui lòng kiểm tra lại hành động xóa');
        error.status = 401;
        throw error;
      };
        let checked1 = await KhenthuongtaptheCapdoi.findOne({
          capkhen : id
      });

      if(checked1!== null){
        const error = new Error('Thao tác xóa thất bại do có khen thưởng chưa dữ liệu liên quan đến cập khen thưởng muốn xóa. Vui lòng kiểm tra lại hành động xóa');
        error.status = 401;
        throw error;
      };

        let checked2 = await Khenthuongcanhan.findOne({
          capkhen : id
      });

      if(checked2!== null){
        const error = new Error('Thao tác xóa thất bại do có khen thưởng chưa dữ liệu liên quan đến cập khen thưởng muốn xóa. Vui lòng kiểm tra lại hành động xóa');
        error.status = 401;
        throw error;
      };
      await Capkhenthuongs.findByIdAndDelete(id);
      let khois = await Capkhenthuongs.find().sort({ thutu: 1 });

      res.status(200).json({ khois, message: "Xóa thành công!" })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: error.message,
      });
    }
  }

};
