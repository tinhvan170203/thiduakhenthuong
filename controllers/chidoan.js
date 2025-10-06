const Chidoans = require("../models/Chidoans");
const Donvis = require("../models/Donvis");
const Khenthuongtapthe = require("../models/Khenthuongtapthe");
const Users = require("../models/UsersDoanvien");

module.exports = {

  getChidoans: async (req, res) => {
    let { tenchidoan } = req.query;
    try {
      let chidoans = await Chidoans.find({
        tenchidoan: { $regex: tenchidoan, $options: "i" },
      }).sort({ thutu: 1 }).populate('nhomdonvithuocchidoan');
      res.status(200).json(chidoans);
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra khi lấy danh sách chi đoàn. Vui lòng liên hệ quản trị viên",
      });
    }
  },
  
  addChidoan: async (req, res) => {
    let {tenchidoan, thutu, status, nhomdonvithuocchidoan} = req.body;
 
    let questionParam = req.body.queryParams.tenchidoan;
    nhomdonvithuocchidoan = nhomdonvithuocchidoan.map(i=>i.value)
    try {
        let chidoan = new Chidoans({tenchidoan, thutu, status, nhomdonvithuocchidoan});
        await chidoan.save();

        let chidoans = await Chidoans.find({
          tenchidoan: { $regex: questionParam, $options: "i" },
        }).sort({thutu: 1}).populate('nhomdonvithuocchidoan')
        res.status(200).json({chidoans, message: "Thêm mới chi đoàn thành công!"})
    } catch (error) {
        console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra khi thêm mới chi đoàn. Vui lòng liên hệ quản trị viên",
      });
    }
  },

  updateChidoan: async (req, res) => {
    let {tenchidoan, thutu, status, nhomdonvithuocchidoan} = req.body;
    let questionParam = req.body.queryParams.tenchidoan;
    nhomdonvithuocchidoan = nhomdonvithuocchidoan.map(i=>i.value)
    let id = req.params.id;
    try {
      await Chidoans.findByIdAndUpdate(id,{
        tenchidoan, thutu, status, nhomdonvithuocchidoan
      });

      let chidoans = await Chidoans.find({
        tenchidoan: { $regex: questionParam, $options: "i" },
      }).sort({thutu: 1}).populate('nhomdonvithuocchidoan')

      res.status(200).json({chidoans, message: "Update chi đoàn thành công!"})
  } catch (error) {
      console.log("lỗi: ", error.message);
    res.status(401).json({
      status: "failed",
      message: "Có lỗi xảy ra khi update chi đoàn. Vui lòng liên hệ quản trị viên",
    });
  }
  },

  deleteChidoan:  async (req, res) => {
    let id = req.params.id;
    let {tenchidoan} = req.query;
    try {
      await Chidoans.findByIdAndDelete(id);
      //xóa tất cả các khen thưởng của chi đoàn đó 
      await Khenthuongtapthe.deleteMany({
        nhomchidoanduockhenthuong: id
      });

      await Users.updateMany({$pull: { quantrinhomchidoan: id}});


      let chidoans = await Chidoans.find({
        tenchidoan: { $regex: tenchidoan, $options: "i" },
      }).sort({thutu: 1}).populate('nhomdonvithuocchidoan');

      res.status(200).json({chidoans, message: "Xóa chi đoàn thành công!"})
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: error.message,
      });
    }
  },

  getChidoansOfUser: async (req, res)=>{
    let userId = req.userId.userId;
    try {
      const user = await Users.findOne({ _id: userId }).populate('quantrinhomchidoan');
      const chidoans = user.quantrinhomchidoan;
      res.status(200).json(chidoans)
    } catch (error) {
      
    }

  },

};
