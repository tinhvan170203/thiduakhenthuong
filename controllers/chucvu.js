const Chucvus = require("../models/Chucvus");
const Canbos = require("../models/Canbo");
const HistoriesSystem = require("../models/HistoriesSystem");
module.exports = {
  getChucvus: async (req, res) => {
    try {
      let chucvuList = await Chucvus.find({
      }).sort({ thutu: 1 });
    
      res.status(200).json(chucvuList);
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra khi lấy danh sách chức vụ. Vui lòng liên hệ quản trị viên",
      });
    }
  },
  
  addChucvu: async (req, res) => {
    try {
        let newItem = new Chucvus(req.body);
        await newItem.save();

        let chucvuList = await Chucvus.find({
        }).sort({thutu: 1})
        res.status(200).json({chucvuList, message: "Thêm mới chức vụ thành công!"})
    } catch (error) {
        console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra khi thêm mới chức vụ. Vui lòng liên hệ quản trị viên",
      });
    }
  },

  updateChucvu: async (req, res) => {
    let { thutu,chucvu} = req.body;

    let id = req.params.id;
    try {
      await Chucvus.findByIdAndUpdate(id,{
          thutu, chucvu, 
      });

      let chucvuList = await Chucvus.find({
      }).sort({thutu: 1})

      res.status(200).json({chucvuList, message: "Update chức vụ thành công!"})
  } catch (error) {
      console.log("lỗi: ", error.message);
    res.status(401).json({
      status: "failed",
      message: "Có lỗi xảy ra khi update chức vụ. Vui lòng liên hệ quản trị viên",
    });
  }
  },

  deleteChucvu:  async (req, res) => {
    let id = req.params.id;
    try {
      let checked = await Canbos.findOne({
        "chucvu.chucvu" : id
      });

      if(checked!== null){
        const error = new Error('Thao tác xóa thất bại do có cán bộ đang có dữ liệu liên quan đến chức vụ bạn muốn xóa. Vui lòng kiểm tra lại hành động xóa chức vụ');
        error.status = 401;
        throw error;
      };

      await Chucvus.findByIdAndDelete(id);
      let chucvuList = await Chucvus.find({
      }).sort({thutu: 1});

      res.status(200).json({chucvuList, message: "Xóa chức vụ thành công!"})
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: error.message,
      });
    }
  }

};
