const Roles = require("../models/Roles");
const Users = require("../models/UsersDoanvien");

module.exports = {
  getRoles: async (req, res) => {
    try {
      let rolesList = await Roles.find({
      }).sort({ thutu: 1 });
      res.status(200).json(rolesList);
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra khi lấy danh sách nhóm quyền. Vui lòng liên hệ quản trị viên",
      });
    }
  },
  
  addRole: async (req, res) => {
    try {
        let newItem = new Roles(req.body);
        await newItem.save();

        let rolesList = await Roles.find({
        }).sort({thutu: 1})
        res.status(200).json({rolesList, message: "Thêm mới nhóm quyền thành công!"})
    } catch (error) {
        console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra khi thêm mới nhóm quyền. Vui lòng liên hệ quản trị viên",
      });
    }
  },

  updateRole: async (req, res) => {
    let {tennhom, thutu, status, mota, roles} = req.body;

    let id = req.params.id;
    try {
      await Roles.findByIdAndUpdate(id,{
       tennhom, mota, roles, thutu, status
      });

      let rolesList = await Roles.find({
      }).sort({thutu: 1})

      res.status(200).json({rolesList, message: "Update nhóm quyền thành công!"})
  } catch (error) {
      console.log("lỗi: ", error.message);
    res.status(401).json({
      status: "failed",
      message: "Có lỗi xảy ra khi update nhóm quyền. Vui lòng liên hệ quản trị viên",
    });
  }
  },

  deleteRole:  async (req, res) => {
    let id = req.params.id;
    try {
      await Users.updateMany({$pull: { roles: id}});
      await Roles.findByIdAndDelete(id);
      let rolesList = await Roles.find({
      }).sort({thutu: 1});

      res.status(200).json({rolesList, message: "Xóa nhóm quyền thành công!"})
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: error.message,
      });
    }
  }

};
