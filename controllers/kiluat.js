
const Kiluatcanhan = require("../models/Kiluatcanhan");
const HistoriesSystem = require("../models/HistoriesSystem");
module.exports = {
  getKiluatcanhan: async (req, res) => {
    let id = req.params.id;
    try {
      let items = await Kiluatcanhan.find({
        canhanbikiluat: id
      }).sort({ ngayky: -1 });
      res.status(200).json(items)
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra!!! Vui lòng liên hệ quản trị viên",
      });
    }
  },

  addKiluatcanhan: async (req, res) => {
    let id = req.body.id; //id cá nhân được khen
    try {
      let { soQD, ngayQD, nguoiky, ngayky, noidung, hinhthuc} = req.body;
      hinhthuc = hinhthuc.value;
      let item = new Kiluatcanhan({
        soQD, ngayQD, nguoiky, ngayky, noidung, hinhthuc,  canhanbikiluat: id
      });
      await item.save();
        await saveAction(req.userId.userId, `Thêm mới kỉ luật cá nhân`)
        res.status(200).json({ message: "Thêm mới kỉ luật thành công!" })
      } catch (error) {
        console.log("lỗi: ", error.message);
        res.status(401).json({
          status: "failed",
          message: "Có lỗi xảy ra!!! Vui lòng liên hệ quản trị viên",
        });
    }
  },

  editKiluatcanhan: async (req, res) => {
    let id = req.params.id
    let { soQD, ngayQD, nguoiky, ngayky, noidung, hinhthuc } = req.body;
    hinhthuc = hinhthuc.value;
    try {
      await Kiluatcanhan.findByIdAndUpdate(id, {
        soQD, ngayQD, nguoiky, ngayky,
        noidung, hinhthuc
      });

      await saveAction(req.userId.userId, `Chỉnh sửa kỉ luật cá nhân`)
      res.status(200).json({ message: "Update kỉ luật thành công!" })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra!!! Vui lòng liên hệ quản trị viên",
      });
    }
  },

  deleteKiluatcanhan: async (req, res) => {
    let id = req.params.id; // id khen cá nhân
    try {
      await Kiluatcanhan.findByIdAndDelete(id);
        await saveAction(req.userId.userId, `Xóa kỉ luật cá nhân`)
      res.status(200).json({ message: "Xóa kỉ luật cá nhân thành công!" })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra!!! Vui lòng liên hệ quản trị viên",
      });
    }
  },

  searchKiluatcanhan: async (req, res) => {
    let { soQD, nguoiky, noidung,
      hinhthuc, tungay, denngay }
      = req.query;

      let id_canbo = req.params.id;
// console.log(req.query)
    if (tungay === "") {
      tungay = "1970-01-01"
    };
    if (denngay === "") {
      denngay = "9999-99-99"
    };
    try {
      let items = await Kiluatcanhan.find({
        soQD: { $regex: soQD, $options: "i" },
        nguoiky: { $regex: nguoiky, $options: "i" },
        noidung: { $regex: noidung, $options: "i" },
        ngayky: {
          $gte: tungay,
          $lte: denngay,
        },
        hinhthuc: { $regex: hinhthuc, $options: "i" },
        canhanbikiluat: id_canbo
      }).sort({ ngayky: -1 });
      res.status(200).json(items)
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra!!! Vui lòng liên hệ quản trị viên",
      });
    }
  }
};
