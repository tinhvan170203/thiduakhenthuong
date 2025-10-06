const Bachams = require("../models/Bachams");
const Canbos = require("../models/Canbo");

module.exports = {
  getBachams: async (req, res) => {
    try {
      let bachamList = await Bachams.find({
      }).sort({ thutu: 1 });
      res.status(200).json(bachamList);
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra khi lấy danh sách bậc hàm. Vui lòng liên hệ quản trị viên",
      });
    }
  },
  
  addBacham: async (req, res) => {
    try {
        let newItem = new Bachams(req.body);
        await newItem.save();

        let bachamList = await Bachams.find({
        }).sort({thutu: 1})
        res.status(200).json({bachamList, message: "Thêm mới bậc hàm thành công!"})
    } catch (error) {
        console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra khi thêm mới bậc hàm. Vui lòng liên hệ quản trị viên",
      });
    }
  },

  updateBacham: async (req, res) => {
    let { thutu,bacham, nienhan} = req.body;

    let id = req.params.id;
    try {
      await Bachams.findByIdAndUpdate(id,{
         Bachams, thutu, bacham, nienhan
      });

      let bachamList = await Bachams.find({
      }).sort({thutu: 1})

      res.status(200).json({bachamList, message: "Update bậc hàm thành công!"})
  } catch (error) {
      console.log("lỗi: ", error.message);
    res.status(401).json({
      status: "failed",
      message: "Có lỗi xảy ra khi update bậc hàm. Vui lòng liên hệ quản trị viên",
    });
  }
  },

  deleteBacham:  async (req, res) => {
    let id = req.params.id;
    try {
      let checked = await Canbos.findOne({
        "bacham.bacham" : id
      });

      if(checked!== null){
        const error = new Error('Thao tác xóa thất bại do có cán bộ chứa dữ liệu bậc hàm bạn muốn xóa. Vui lòng kiểm tra lại hành động xóa bậc hàm');
        error.status = 401;
        throw error;
      };

      await Bachams.findByIdAndDelete(id);
      let bachamList = await Bachams.find({
      }).sort({thutu: 1});

      res.status(200).json({bachamList, message: "Xóa bậc hàm thành công!"})
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: error.message,
      });
    }
  }

};
