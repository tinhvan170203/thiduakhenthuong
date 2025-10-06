const Notifications = require("../models/Notifications");
const HistoriesSystem = require("../models/HistoriesSystem");
module.exports = {
  getNotifications: async (req, res) => {
    let { thongbao } = req.query;
    try {
      let notifications = await Notifications.find({
        thongbao: { $regex: thongbao, $options: "i" },
      }).sort({ thutu: 1 });
      res.status(200).json(notifications);
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra khi lấy danh sách thông báo. Vui lòng liên hệ quản trị viên",
      });
    }
  },
  
  addNotification: async (req, res) => {
    let {thongbao, thutu, status} = req.body;
    let questionParam = req.body.queryParams.thongbao;
    try {
        let notification = new Notifications({thongbao, thutu, status});
        await notification.save();

        let notifications = await Notifications.find({
          thongbao: { $regex: questionParam, $options: "i" },
        }).sort({thutu: 1})
        res.status(200).json({notifications, message: "Thêm mới thông báo thành công!"})
    } catch (error) {
        console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra khi thêm mới thông báo. Vui lòng liên hệ quản trị viên",
      });
    }
  },

  updateNotification: async (req, res) => {
    let {thongbao, thutu, status} = req.body;
    let questionParam = req.body.queryParams.thongbao;
 
    let id = req.params.id;
    try {
      await Notifications.findByIdAndUpdate(id,{
        thongbao, thutu, status
      });

      let notifications = await Notifications.find({
        thongbao: { $regex: questionParam, $options: "i" },
      }).sort({thutu: 1})

      res.status(200).json({notifications, message: "Update thông báo thành công!"})
  } catch (error) {
      console.log("lỗi: ", error.message);
    res.status(401).json({
      status: "failed",
      message: "Có lỗi xảy ra khi update thông báo. Vui lòng liên hệ quản trị viên",
    });
  }
  },

  deleteNotification:  async (req, res) => {
    let id = req.params.id;
    let {thongbao} = req.query;
    try {
      await Notifications.findByIdAndDelete(id);
      let notifications = await Notifications.find({
        thongbao: { $regex: thongbao, $options: "i" },
      }).sort({thutu: 1});

      res.status(200).json({notifications, message: "Xóa thông báo thành công!"})
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra khi xóa thông báo. Vui lòng liên hệ quản trị viên",
      });
    }
  }

};
