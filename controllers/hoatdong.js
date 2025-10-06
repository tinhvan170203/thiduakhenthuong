const Donvis = require("../models/Donvis");
const Hoatdongs = require("../models/Hoatdong");
const Khois = require("../models/Khois");

module.exports = {
  getHoatdongs: async (req, res) => {
    let id_user = req.userId.userId;
    try {
        let khois = await Hoatdongs.find({
            user: id_user
        }).sort({ngay: -1})
      res.status(200).json(khois);
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên",
      });
    }
  },
  
  addHoatdong: async (req, res) => {
    let id_user = req.userId.userId;
    let {noidung, ghichu, ngay, doanvien, diadiem} = req.body;
    try {
        let khoi = new Hoatdongs({noidung, ghichu, ngay, doanvien, diadiem, user: id_user});
        await khoi.save();

        let khois = await Hoatdongs.find({
            user: id_user
        }).sort({ngay: -1})
        res.status(200).json({khois, message: "Thêm mới thành công!"})
    } catch (error) {
        console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra khi thêm mới . Vui lòng liên hệ quản trị viên",
      });
    }
  },

  updateHoatdong: async (req, res) => {
    let id_user = req.userId.userId;
    let {noidung, ghichu, ngay, doanvien, diadiem} = req.body;
 
    let id = req.params.id;
    try {
      await Hoatdongs.findByIdAndUpdate(id,{
        noidung, ghichu, ngay, doanvien, diadiem
      });

      let khois = await Hoatdongs.find({
        user: id_user
    }).sort({ngay: -1})

      res.status(200).json({khois, message: "Update thành công!"})
  } catch (error) {
      console.log("lỗi: ", error.message);
    res.status(401).json({
      status: "failed",
      message: "Có lỗi xảy ra khi update. Vui lòng liên hệ quản trị viên",
    });
  }
  },

  deleteHoatdong:  async (req, res) => {
    let id = req.params.id;
    let id_user = req.userId.userId;
    try {
     
      await Hoatdongs.findByIdAndDelete(id);
      let khois = await Hoatdongs.find({
        user: id_user
    }).sort({ngay: -1})

      res.status(200).json({khois, message: "Xóa thành công!"})
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: error.message,
      });
    }
  },

  searchHoatdong: async (req, res) => {
    let id_user = req.userId.userId;
    let {noidung_search, ghichu_search, tungay_search,denngay_search, doanvien_search, diadiem_search} = req.query;
    if(tungay_search === ""){
        tungay_search = "1970-01-01"
    };
    if(denngay_search === ""){
        denngay_search = "9999-01-01"
    };
    console.log(req.query)
    try {
        let khois = await Hoatdongs.find({
            noidung: { $regex: noidung_search, $options: "i" },
            ghichu: { $regex: ghichu_search, $options: "i" },
            doanvien: { $regex: doanvien_search, $options: "i" },
            diadiem: { $regex: diadiem_search, $options: "i" },
            user: id_user,
            ngay: {
                $gte:  tungay_search,
                $lte: denngay_search
            }
        }).sort({ngay: -1})
        res.status(200).json(khois)
    } catch (error) {
        console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: error.message,
      });
    }
  },

};
