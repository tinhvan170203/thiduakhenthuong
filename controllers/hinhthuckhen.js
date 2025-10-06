const Hinhthuckhens = require("../models/Hinhthuckhens");
const Khenthuongcanhan = require("../models/Khenthuongcanhan");
const Khenthuongtapthe = require("../models/Khenthuongtapthe");
const KhenthuongtaptheCapdoi = require("../models/Khenthuongtapthecapdoi");
const HistoriesSystem = require("../models/HistoriesSystem");

module.exports = {

  getHinhthuckhens: async (req, res) => {
    try {
      let khois = await Hinhthuckhens.find().sort({ thutu: 1 });
      res.status(200).json(khois);
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên",
      });
    }
  },

  addHinhthuckhen: async (req, res) => {
    let { hinhthuckhen, thutu, status } = req.body;
    try {
      let khoi = new Hinhthuckhens({ hinhthuckhen, thutu, status });
      await khoi.save();

      let khois = await Hinhthuckhens.find().sort({ thutu: 1 })
      res.status(200).json({ khois, message: "Thêm mới thành công!" })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra khi thêm mới. Vui lòng liên hệ quản trị viên",
      });
    }
  },

  updateHinhthuckhen: async (req, res) => {
    let { hinhthuckhen, thutu, status } = req.body;

    let id = req.params.id;
    try {
      await Hinhthuckhens.findByIdAndUpdate(id, {
        hinhthuckhen, thutu, status
      });

      let khois = await Hinhthuckhens.find().sort({ thutu: 1 })

      res.status(200).json({ khois, message: "Update thành công!" })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra khi update. Vui lòng liên hệ quản trị viên",
      });
    }
  },

  deleteHinhthuckhen: async (req, res) => {
    let id = req.params.id;
    try {
      let checked = await Khenthuongtapthe.findOne({
        hinhthuc: id
      });

      if (checked !== null) {
        const error = new Error('Thao tác xóa thất bại do có hình thức khen chưa dữ liệu liên quan đến cập hình thức khen muốn xóa. Vui lòng kiểm tra lại hành động xóa');
        error.status = 401;
        throw error;
      };
      let checked1 = await KhenthuongtaptheCapdoi.findOne({
        hinhthuc: id
      });

      if (checked1 !== null) {
        const error = new Error('Thao tác xóa thất bại do có hình thức khen chưa dữ liệu liên quan đến cập hình thức khen muốn xóa. Vui lòng kiểm tra lại hành động xóa');
        error.status = 401;
        throw error;
      };

      let checked2 = await Khenthuongcanhan.findOne({
        hinhthuc: id
      });

      if (checked2 !== null) {
        const error = new Error('Thao tác xóa thất bại do có hình thức khen chưa dữ liệu liên quan đến cập hình thức khen muốn xóa. Vui lòng kiểm tra lại hành động xóa');
        error.status = 401;
        throw error;
      };
      await Hinhthuckhens.findByIdAndDelete(id);
      let khois = await Hinhthuckhens.find().sort({ thutu: 1 });

      res.status(200).json({ khois, message: "Xóa thành công!" })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: error.message,
      });
    }
  },

};
