const Chidoans = require("../models/Chidoans");
const Danhhieuthiduas = require("../models/Danhhieuthiduas");
const DanhhieuthiduasCapdois = require("../models/DanhhieuthiduasCapdoi");
const Dois = require("../models/Dois");
const Khenthuongcanhan = require("../models/Khenthuongcanhan");
const Khenthuongtapthe = require("../models/Khenthuongtapthe");
const KhenthuongtaptheCapdoi = require("../models/Khenthuongtapthecapdoi");
const Users = require("../models/Users");const HistoriesSystem = require("../models/HistoriesSystem");
const saveAction = async (user_id, action) => {
  let newAction = new HistoriesSystem({
    user: user_id,
    action: action
  })
  await newAction.save();
};


module.exports = {

  getKhentapthes: async (req, res) => {
    let { soQD, nguoiky,
      taptheduockhenthuong, noidung,
      hinhthuc, capkhen, tungay, denngay }
      = req.query;
    // console.log(req.query)
    if (tungay === "") {
      tungay = "1970-01-01"
    };
    if (denngay === "") {
      denngay = "9999-99-99"
    };

    let userId = req.userId.userId;

    // danh sach cac doi, to cong tac thuoc tai khoan
    let quantrinhomdonvi = await Dois.find({ donvi: userId }).sort({ thutu: 1 });
    quantrinhomdonvi = quantrinhomdonvi.map(i => i._id.toString());

    try {
      let data = [];
      // lấy ra các khen thưởng cấp phòng
      //check xem search là tất cả hay là đang chọn chỉ lấy cấp phòng
      if (taptheduockhenthuong === "" || taptheduockhenthuong === req.userId.userId) {
        let items = await Khenthuongtapthe.find({
          soQD: { $regex: soQD, $options: "i" },
          nguoiky: { $regex: nguoiky, $options: "i" },
          noidung: { $regex: noidung, $options: "i" },
          ngayky: {
            $gte: tungay,
            $lte: denngay,
          },
          tapthe: userId
        }).populate('hinhthuc capkhen').populate('tapthe');
        items.forEach(item => {
          data.push({ ...item._doc, tapthe: item.tapthe.tenhienthi, tapthe_id: item.tapthe._id, cap: 'phòng' })
        });
      };

      //lấy ra khen thưởng cấp đội, tổ
      if (taptheduockhenthuong === "") {
        // console.log('loi')
        let items_capdoi = await KhenthuongtaptheCapdoi.find({
          soQD: { $regex: soQD, $options: "i" },
          nguoiky: { $regex: nguoiky, $options: "i" },
          noidung: { $regex: noidung, $options: "i" },
          ngayky: {
            $gte: tungay,
            $lte: denngay,
          },
          tapthe: { $in: quantrinhomdonvi }
        }).populate('hinhthuc capkhen').populate('tapthe', { tendoi: 1 });
        items_capdoi.forEach(item => {
          data.push({ ...item._doc, tapthe: item.tapthe.tendoi, tapthe_id: item.tapthe._id, cap: 'đội' })
        })
      };

      if (taptheduockhenthuong !== "" && taptheduockhenthuong !== req.userId.userId) {
        // console.log('loi')
        let items_capdoi = await KhenthuongtaptheCapdoi.find({
          soQD: { $regex: soQD, $options: "i" },
          nguoiky: { $regex: nguoiky, $options: "i" },
          noidung: { $regex: noidung, $options: "i" },
          ngayky: {
            $gte: tungay,
            $lte: denngay,
          },
          tapthe: taptheduockhenthuong
        }).populate('hinhthuc capkhen').populate('tapthe', { tendoi: 1 });
        items_capdoi.forEach(item => {
          data.push({ ...item._doc, tapthe: item.tapthe.tendoi, tapthe_id: item.tapthe._id, cap: 'đội' })
        })
      };

      data = data.filter(i => i.ngayky >= tungay && i.ngayky <= denngay
        && i.hinhthuc.toString().includes(hinhthuc) && i.capkhen.toString().includes(capkhen)).sort((a, b) => {
          let x = (new Date(a.ngayky)).getTime();
          let y = (new Date(b.ngayky)).getTime();
          return y - x
        });

      res.status(200).json(data);
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra!!! Vui lòng liên hệ quản trị viên",
      });
    }
  },

  addKhentapthe: async (req, res) => {
    let { soQD, ngayQD, nguoiky, ngayky, taptheduockhenthuong, noidung, hinhthuc, capkhen } = req.body;
    // console.log(req.body)
    taptheduockhenthuong = taptheduockhenthuong.value;
    hinhthuc = hinhthuc.value;
    capkhen = capkhen.value;
    try {

      //check xem khen thưởng cấp phòng hay tổ đội dựa vào id_user
      let check = req.userId.userId === taptheduockhenthuong;

      if (check) {
        let item = new Khenthuongtapthe({
          soQD, ngayQD, nguoiky, ngayky, tapthe: taptheduockhenthuong, noidung, hinhthuc, capkhen
        });
        await item.save();
        await saveAction(req.userId.userId, `Thêm mới khen thưởng tập thể cấp phòng, công an xã`)
      } else {
        let item = new KhenthuongtaptheCapdoi({
          soQD, ngayQD, nguoiky, ngayky, tapthe: taptheduockhenthuong, noidung, hinhthuc, capkhen
        });
        await item.save();
        await saveAction(req.userId.userId, `Thêm mới khen thưởng tập thể cấp đội, tổ công tác`)
      }
      res.status(200).json({ message: "Thêm mới khen thưởng tập thể thành công!" })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra!!! Vui lòng liên hệ quản trị viên",
      });
    }
  },

  updateKhentapthe: async (req, res) => {
    let { soQD, ngayQD, nguoiky, capkhenBefore, ngayky, taptheduockhenthuong, noidung, hinhthuc, capkhen } = req.body;
    taptheduockhenthuong = taptheduockhenthuong.value;

    hinhthuc = hinhthuc.value;
    capkhen = capkhen.value;
    let id = req.params.id;
    try {
      // kiểm tra xem có phải thay đổi từ khen thưởng cấp phòng --> đội hoặc đội ---> phòng không 
      // để xóa  bản ghi cũ và thêm mới bản ghi vào model thay đổi
      // kiểm tra xem khen thưởng có phải của phòng k
      let capkhenAfter = taptheduockhenthuong === req.userId.userId ? "phòng" : "đội";
      let check = capkhenBefore === capkhenAfter;
      if (check && capkhenAfter === "phòng") {
        await Khenthuongtapthe.findByIdAndUpdate(id, {
          soQD, ngayQD, nguoiky, ngayky, tapthe: taptheduockhenthuong,
          noidung, hinhthuc, capkhen
        });
          await saveAction(req.userId.userId, `Chỉnh sửa khen thưởng tập thể cấp phòng, công an xã`)
      };

      if (check && capkhenAfter === "đội") {
        await KhenthuongtaptheCapdoi.findByIdAndUpdate(id, {
          soQD, ngayQD, nguoiky, ngayky, tapthe: taptheduockhenthuong,
          noidung, hinhthuc, capkhen
        });
          await saveAction(req.userId.userId, `Chỉnh sửa khen thưởng tập thể cấp đội, tổ công tác`)
      };
      // trường hợp sửa thay đổi khen thưởng của cấp phòng thành đội
      // xóa bản ghi ở khen thưởng phòng và thêm mới bản ghi ở cấp đội
      if (!check && capkhenBefore === "phòng") {
        await Khenthuongtapthe.findByIdAndDelete(id);

        let item = new KhenthuongtaptheCapdoi({
          soQD, ngayQD, nguoiky, ngayky, tapthe: taptheduockhenthuong, noidung, hinhthuc, capkhen
        });
        await item.save();
         await saveAction(req.userId.userId, `Chỉnh sửa khen thưởng tập thể cấp từ cấp tổ, đội thành cấp phòng, công an xã`)
      };

      if (!check && capkhenBefore === "đội") {
        await KhenthuongtaptheCapdoi.findByIdAndDelete(id);

        let item = new Khenthuongtapthe({
          soQD, ngayQD, nguoiky, ngayky, tapthe: taptheduockhenthuong, noidung, hinhthuc, capkhen
        });
        await item.save();
                 await saveAction(req.userId.userId, `Chỉnh sửa khen thưởng tập thể từ cấp phòng, công an xã thành cấp tổ, đội`)
      };

      res.status(200).json({ message: "Update khen thưởng tập thể thành công!" });
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra!!! Vui lòng liên hệ quản trị viên",
      });
    }
  },

  deleteKhentapthe: async (req, res) => {
    let id = req.params.id;
    let { capkhenBefore } = req.query;
    // console.log(req.query)
    // console.log(id)
    try {
      //check xem xóa khen thưởng cấp phòng hay đội
      if (capkhenBefore === "phòng") {
        await Khenthuongtapthe.findByIdAndDelete(id);
      } else {
        await KhenthuongtaptheCapdoi.findByIdAndDelete(id);
      }
      res.status(200).json({ message: "Xóa khen thưởng tập thể thành công!" })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra!!! Vui lòng liên hệ quản trị viên",
      });
    }
  },

  getKhencanhan: async (req, res) => {
    let id = req.params.id;
    try {
      let items = await Khenthuongcanhan.find({
        canhanduockhenthuong: id
      }).sort({ ngayky: -1 }).populate('capkhen').populate('hinhthuc');
      res.status(200).json(items)
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra!!! Vui lòng liên hệ quản trị viên",
      });
    }
  },

  addKhencanhan: async (req, res) => {
    let id = req.body.id; //id cá nhân được khen
    try {
      let { soQD, ngayQD, nguoiky, ngayky, noidung, hinhthuc, capkhen } = req.body;
      hinhthuc = hinhthuc.value;
      capkhen = capkhen.value;
      let item = new Khenthuongcanhan({
        soQD, ngayQD, nguoiky, ngayky, noidung, hinhthuc, capkhen, canhanduockhenthuong: id
      });
      await item.save();
        await saveAction(req.userId.userId, `Thêm mới khen thưởng cho cá nhân`)
      res.status(200).json({ message: "Thêm mới khen thưởng cho cá nhân thành công!" })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra!!! Vui lòng liên hệ quản trị viên",
      });
    }
  },

  editKhencanhan: async (req, res) => {
    let id = req.params.id
    let { soQD, ngayQD, nguoiky, ngayky, noidung, hinhthuc, capkhen } = req.body;
    hinhthuc = hinhthuc.value;
    capkhen = capkhen.value;
    try {
      await Khenthuongcanhan.findByIdAndUpdate(id, {
        soQD, ngayQD, nguoiky, ngayky,
        noidung, hinhthuc, capkhen
      });
  await saveAction(req.userId.userId, `Chỉnh sửa khen thưởng cá nhân`)
      res.status(200).json({ message: "Update khen thưởng cá nhân thành công!" })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra!!! Vui lòng liên hệ quản trị viên",
      });
    }
  },

  deleteKhencanhan: async (req, res) => {
    let id = req.params.id; // id khen cá nhân
    try {
      await Khenthuongcanhan.findByIdAndDelete(id);
      res.status(200).json({ message: "Xóa khen thưởng cá nhân thành công!" })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra!!! Vui lòng liên hệ quản trị viên",
      });
    }
  },

  searchKhencanhan: async (req, res) => {
    let { soQD, nguoiky, noidung,
      hinhthuc, capkhen, tungay, denngay }
      = req.query;

    if (tungay === "") {
      tungay = "1970-01-01"
    };
    if (denngay === "") {
      denngay = "9999-99-99"
    };
    try {
      let items = await Khenthuongcanhan.find({
        soQD: { $regex: soQD, $options: "i" },
        nguoiky: { $regex: nguoiky, $options: "i" },
        noidung: { $regex: noidung, $options: "i" },
        ngayky: {
          $gte: tungay,
          $lte: denngay,
        },
        hinhthuc: { $regex: hinhthuc, $options: "i" },
        capkhen: { $regex: capkhen, $options: "i" },
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

  // danh hieeuj thi dua
  getDanhhieuthiduas: async (req, res) => {
    let { nam, taptheduockhenthuong, noidung }
      = req.query;
    // console.log(req.query)
    let userId = req.userId.userId;

    // danh sach cac doi, to cong tac thuoc tai khoan
    let quantrinhomdonvi = await Dois.find({ donvi: userId }).sort({ thutu: 1 });
    quantrinhomdonvi = quantrinhomdonvi.map(i => i._id.toString()).push(req.userId.userId);

    try {
      let data = [];

      //check xem search là tất cả hay là đang chọn chỉ lấy cấp phòng
      if (taptheduockhenthuong === "" || taptheduockhenthuong === req.userId.userId) {
        let items = await Danhhieuthiduas.find({
          // nam,
          noidung: { $regex: noidung, $options: "i" }
        }).populate('tapthe');
        items.filter(e=>e.tapthe._id.toString().includes(req.userId.userId)).forEach(item => {
          data.push({ ...item._doc, tapthe: item.tapthe.tenhienthi, tapthe_id: item.tapthe._id, cap: 'phòng' })
        });
      };

      //lấy ra danh hiệu thi đua cấp đội, tổ
      if (taptheduockhenthuong === "") {
        // console.log('loi')
        let items_capdoi = await DanhhieuthiduasCapdois.find({
          // nam,
          noidung: { $regex: noidung, $options: "i" }
        }).populate('tapthe', { tendoi: 1 });
        items_capdoi.forEach(item => {
          data.push({ ...item._doc, tapthe: item.tapthe.tendoi, tapthe_id: item.tapthe._id, cap: 'đội' })
        })
      };

      if (taptheduockhenthuong !== "" && taptheduockhenthuong !== req.userId.userId) {

        let items_capdoi = await DanhhieuthiduasCapdois.find({
          // nam,
          noidung: { $regex: noidung, $options: "i" },
          tapthe: taptheduockhenthuong
        }).populate('tapthe', { tendoi: 1 });
        items_capdoi.forEach(item => {
          data.push({ ...item._doc, tapthe: item.tapthe.tendoi, tapthe_id: item.tapthe._id, cap: 'đội' })
        })
      };

      data = data.sort((a, b) => b.nam - a.nam);

      res.status(200).json(data);
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra!!! Vui lòng liên hệ quản trị viên",
      });
    }
  },

  addDanhhieuthidua: async (req, res) => {
    let { nam, taptheduockhenthuong, noidung } = req.body;
    // console.log(req.body)
    taptheduockhenthuong = taptheduockhenthuong.value;

    try {

      //check xem khen thưởng cấp phòng hay tổ đội dựa vào id_user
      let check = req.userId.userId === taptheduockhenthuong;

      if (check) {
        // kiểm tra xem có năm thi đua trong csdl chưa
        let checked = await Danhhieuthiduas.findOne({ nam, tapthe: taptheduockhenthuong });
        if (checked) {
          res.status(401).json({ message: `Tập thể đã có danh hiệu thi đua năm ${nam} trong hệ thống` });
          return;
        };

        let item = new Danhhieuthiduas({
          nam, tapthe: taptheduockhenthuong, noidung
        });
        await item.save();
          await saveAction(req.userId.userId, `Thêm mới danh hiệu thi đua tập thể cấp phòng, công an xã`)
      } else {

        let checked = await DanhhieuthiduasCapdois.findOne({ nam, tapthe: taptheduockhenthuong });
        if (checked) {
          res.status(401).json({ message: `Tập thể đã có danh hiệu thi đua năm ${nam} trong hệ thống` });
          return;
        };

        let item = new DanhhieuthiduasCapdois({
          nam, tapthe: taptheduockhenthuong, noidung
        });
        await item.save();
          await saveAction(req.userId.userId, `Thêm mới danh hiệu thi đua tập thể cấp đội, tổ công tác`)
      }
      res.status(200).json({ message: "Thêm mới danh hiệu thi đua thành công!" })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra!!! Vui lòng liên hệ quản trị viên",
      });
    }
  },

  updateDanhhieuthidua: async (req, res) => {
    let { taptheduockhenthuong, noidung } = req.body;
    taptheduockhenthuong = taptheduockhenthuong.value;

    let id = req.params.id;
    try {
      // kiểm tra xem có phải thay đổi từ khen thưởng cấp phòng --> đội hoặc đội ---> phòng không 
      // để xóa  bản ghi cũ và thêm mới bản ghi vào model thay đổi
      // kiểm tra xem khen thưởng có phải của phòng k
      let capkhenAfter = taptheduockhenthuong === req.userId.userId ? "phòng" : "đội";

      if (capkhenAfter === "phòng") {
        await Danhhieuthiduas.findByIdAndUpdate(id, {
          noidung
        });
          await saveAction(req.userId.userId, `Chỉnh sửa danh hiệu thi đua cấp phòng, công an xã`)
        };
        
        if (capkhenAfter === "đội") {
          await DanhhieuthiduasCapdois.findByIdAndUpdate(id, {
            noidung
          });
          await saveAction(req.userId.userId, `Chỉnh sửa danh hiệu thi đua cấp đội, tổ công tác`)
      };

      res.status(200).json({ message: "Update danh hiệu thi đua tập thể thành công!" });
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra!!! Vui lòng liên hệ quản trị viên",
      });
    }
  },

  deleteDanhhieuthidua: async (req, res) => {
    let id = req.params.id;
    let { capkhenBefore } = req.query;

    try {
      //check xem xóa khen thưởng cấp phòng hay đội
      if (capkhenBefore === "phòng") {
        await Danhhieuthiduas.findByIdAndDelete(id);
          await saveAction(req.userId.userId, `Xóa danh hiệu thi đua cấp phòng, công an xã`)
        } else {
          await DanhhieuthiduasCapdois.findByIdAndDelete(id);
          await saveAction(req.userId.userId, `Xóa danh hiệu thi đua cấp đội, tổ công tác`)
        }
      res.status(200).json({ message: "Xóa danh hiệu thi đua tập thể thành công!" })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra!!! Vui lòng liên hệ quản trị viên",
      });
    }
  },
};
