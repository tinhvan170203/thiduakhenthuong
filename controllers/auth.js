const jwt = require("jsonwebtoken");
const RefreshTokens = require("../models/RefreshToken");
const Users = require("../models/Users");
const Khois = require("../models/Khois");
const _ = require('lodash');
const Hoatdongs = require("../models/Hoatdong");
const Anhs = require("../models/Anhs");
const path = require("path");
const fs = require('fs');
const Dois = require("../models/Dois");
const Khenthuongtapthe = require("../models/Khenthuongtapthe");
const HistoriesSystem = require("../models/HistoriesSystem");

const saveAction = async (user_id, action) => {
    let newAction = new HistoriesSystem({
        user: user_id,
        action: action
    })
    await newAction.save();
};

module.exports = {
  login: async (req, res) => {
    try {
      let user = await Users.findOne({
        tentaikhoan: req.body.tentaikhoan,
        matkhau: req.body.matkhau,
      }).populate('khoi');
      if (!user) {
        return res.status(401).json({ status: false, message: "Sai tên đăng nhập hoặc mật khẩu" });
      } else {
        //cần kiểm tra xem client có refreshtoken k nếu có thì phải kiểm tra db và xóa đi khi login thành công và tạo mới refreshtoken
        let refreshTokenCookie = req.cookies.refreshToken;
        if (refreshTokenCookie) {
          await RefreshTokens.findOneAndDelete({ refreshToken: refreshTokenCookie })
        };

        //generate accessToken, refreshToken
        const accessToken = jwt.sign({ userId: user._id }, "vuvantinh_accessToken", {
          expiresIn: '15d'
        });


        const refreshToken = jwt.sign({ userId: user._id }, "vuvantinh_refreshToken", {
          expiresIn: '30d'
        });

        let newItem = new RefreshTokens({
          refreshToken
        });
        await newItem.save();
        await saveAction(user._id, `Đăng nhập hệ thống phần mềm`)
        res.status(200).json({ status: "success", _id: user._id, tentaikhoan: user.tentaikhoan, vaitro: user.vaitro, captaikhoan: user.captaikhoan, accessToken, refreshToken });
      }
    } catch (error) {
      console.log(error.message)
      res.status(401).json({ status: "failed", message: "Lỗi đăng nhập hệ thống" });
    }
  },
  logout: async (req, res) => {
    //xóa refreshTonken trong database
    let refreshTokenCookie = req.cookies.refreshToken;
    try {
      if (refreshTokenCookie) {
        await RefreshTokens.findOneAndDelete({ refreshToken: refreshTokenCookie })
      };

      // res.clearCookie('refreshToken_px01');
      await saveAction(req.userId.userId, `Đăng xuất hệ thống phần mềm`);
      res.status(200).json({ status: "success", message: "Đăng xuất thành công" })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({ status: "failed", message: "Lỗi server hệ thống" });
    }
  },
  getUserList: async (req, res) => {
    try {
      let users = await Users.find().populate('khoi')
      res.status(200).json(users)
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({ status: "failed", message: "Có lỗi xảy ra khi lấy dữ liệu người dùng" });
    }
  },
  addUser: async (req, res) => {
    let { tentaikhoan, vaitro, thutu,madonvi, captaikhoan, tenhienthi, khoi, trangthai } = req.body;
    // console.log(req.body)
    try {
      let newItem = new Users({
        tentaikhoan,
        madonvi,
        tenhienthi,
        captaikhoan,
        matkhau: 123456,
        khoi,
        vaitro,
        trangthai,
        thutu
      });
      await newItem.save();
      let users = await Users.find().populate('khoi');
            await saveAction(req.userId.userId, `Thêm mới tài khoản người dùng`)
      res.status(200).json({ status: "success", users, message: "Thêm tài khoản người dùng thành công" })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({ status: "failed", message: "Có lỗi xảy ra khi thêm mới người dùng" });
    }
  },
  editUser: async (req, res) => {
    let id = req.params.id;
    let { tentaikhoan, matkhau, tenhienthi, vaitro, thutu,madonvi, khoi, trangthai } = req.body;
    // console.log(trangthai)
    try {
     let item = await Users.findByIdAndUpdate(id, {
        tentaikhoan,madonvi,
        matkhau,
        tenhienthi, trangthai, vaitro,
        thutu, khoi
      });
      let users = await Users.find().populate('khoi')
    await saveAction(req.userId.userId, `Chỉnh sửa tài khoản người dùng ${item.tentaikhoan}`);
      res.status(200).json({ status: "success", users, message: "Cập nhật tài khoản người dùng thành công" })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({ status: "failed", message: "Có lỗi xảy ra khi cập nhật tài khoản người dùng" });
    }
  },
  deleteUser: async (req, res) => {
    let id = req.params.id;
    // phải check thêm xem có tổ đội nào không, có user nào có dữ liệu liên quan đến tổ đội thuộc đơn vị đó không
    // nếu không có thì xóa hết tất cả các khen thưởng của đơn vị đó để
    try {
      let checked_list_doi_of_user = await Dois.findOne({donvi: id});
      if(checked_list_doi_of_user!== null){
        const error = new Error('Thao tác xóa thất bại do có dữ liệu của tổ, đội công tác thuộc đơn vị bạn muốn xóa. Vui lòng xóa các tổ đội, trước khi xóa người dùng');
        error.status = 401;
        throw error;
      };

      await Khenthuongtapthe.deleteMany({tapthe: id});
      await Users.findByIdAndDelete(id);
      let users = await Users.find().populate('khoi');
      await saveAction(req.userId.userId, `Xóa tài khoản người dùng`);
      res.status(200).json({ status: "success", users, message: "Xóa tài khoản người dùng thành công" })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({ status: "failed", message: error.message });
    }
  },

  requestRefreshToken: async (req, res) => {
    // console.log(req.cookies)
    const refreshToken = req.cookies.refreshToken_quanlydoanvien;
    // console.log(refreshToken)
    if (!refreshToken) {
      return res.status(401).json({ message: 'Token không tồn tại. Vui lòng đăng nhập' })
    };
    // console.log(refreshToken)
    // kiểm tra xem trong db có refreshtoken này không nếu k có thì là k hợp lệ
    const checkRefreshTokenInDb = await RefreshTokens.findOne({ refreshToken });
    // console.log('token',checkRefreshTokenInDb)
    // console.log(checkRefreshTokenInDb)
    if (!checkRefreshTokenInDb) return res.status(403).json({ message: "Token không hợp lệ" });

    jwt.verify(refreshToken, "vuvantinh_refreshToken", async (err, user) => {
      if (err) {
        console.log(err.message)
      };

      const newAccessToken = jwt.sign({ userId: user.userId }, "vuvantinh_accessToken", {
        expiresIn: '15d'
      });

      const newRefreshToken = jwt.sign({ userId: user.userId }, "vuvantinh_refreshToken", {
        expiresIn: '30d'
      });

      await RefreshTokens.findOneAndDelete({ refreshToken: refreshToken })
      // thêm refreshtoken mới vào db sau đó trả về client accesstoken mới
      let newItem = new RefreshTokens({
        refreshToken: newRefreshToken
      });
      await newItem.save()
      res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
      console.log('ok')
    })
  },
  changePassword: async (req, res) => {
    let { id, matkhaucu, matkhaumoi } = req.body;
    try {
      let user = await Users.findOne({ _id: id, matkhau: matkhaucu });
      if (!user) {
        res.status(401).json({ message: "Mật khẩu cũ không chính xác. Vui lòng kiểm tra lại" })
        return;
      }

      user.matkhau = matkhaumoi;
      await user.save();
      res.status(200).json({ message: "Đổi mật khấu thành công. Vui lòng đăng nhập lại." })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({ status: "failed", message: "Lỗi server, Vui lòng liên hệ quản trị hệ thống" });
    }
  },
  // lấy ra danh sách các tài khoản có thể chuyển cán bộ chiến sĩ đến
  getDanhsachDonviTiepnhan: async (req, res) => {
    try {
      let donvis = await Users.find({ trangthai: true, _id: { $ne: req.userId.userId }, vaitro: { $nin: ["Quản trị hệ thống", "Theo dõi thống kê"] } });
      res.status(200).json(donvis)
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({ status: "failed", message: "Lỗi server, Vui lòng liên hệ quản trị hệ thống" });
    }
  },

  // lấy ra danh sách các tài khoản thuộc khối đang active 
  getUsersOfKhoi: async (req, res) => {
    try {
      let { vaitro } = req.query;

      let items = [];
      if (vaitro === "Quản trị thông thường") {
        let user = await Users.findById(req.userId.userId, { _id: 1, tenhienthi: 1, khoi: 1 });

        let khoi = await Khois.findById(user.khoi);
        console.log(khoi)
        items.push({
          khoi: khoi.tenkhoi,
          accounts: [{
            value: user._id,
            name: user.tenhienthi,
            thutu: 1
          }]
        })
      } else {
        let khois = await Khois.find({ status: true }).sort({ thutu: 1 });

        for (let khoi of khois) {
          let accounts = await Users.find({ khoi: khoi._id, trangthai: true }, { _id: 1, tenhienthi: 1, thutu: 1 }).sort({ thutu: -1 });
          accounts = accounts.map(e => ({
            value: e._id,
            name: e.tenhienthi,
            thutu: e.thutu
          }))
          items.push({
            khoi: khoi.tenkhoi,
            accounts: accounts
          });
        };
      }
      res.status(200).json(items)
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({ status: "failed", message: "Lỗi server, Vui lòng liên hệ quản trị hệ thống" });
    }
  },
  fetchImage: async(req, res) =>{
        try {
            let item = await Anhs.find().sort({thutu: 1})
            res.status(200).json(item)
        } catch (error) {
            console.log("lỗi: ", error.message);
            res.status(401).json({ status: "failed", message: "Có lỗi xảy ra" });
        }
  },
  //upload image
  upLoadImage: async(req, res) =>{
     let index = req.file.path.lastIndexOf('\\');
        let link = req.file.path.slice(index + 1)
        // console.log(req.body.noidung)
        try {
            let item = new Anhs({
              url: link,
              noidung: req.body.noidung,
              thutu: req.body.thutu,
              status: req.body.status,
            });
            await item.save();
            await saveAction(req.userId.userId, `Thêm hình ảnh nổi bật`);
            res.status(200).json({message: "Thêm ảnh thành công"})
        } catch (error) {
            console.log("lỗi: ", error.message);
            res.status(401).json({ status: "failed", message: "Có lỗi xảy ra" });
        }
  },

  editImage: async(req, res) =>{
        try {
            let item = await Anhs.findByIdAndUpdate(req.params.id,{
              noidung: req.body.noidung,
              thutu: req.body.thutu,
              status: req.body.trangthai,
            });
            await item.save();
            await saveAction(req.userId.userId, `Chỉnh sửa nội dung hình ảnh`);
            res.status(200).json({message: "Cập nhật thành công"})
        } catch (error) {
            console.log("lỗi: ", error.message);
            res.status(401).json({ status: "failed", message: "Có lỗi xảy ra" });
        }
  },

  deleteImage: async(req, res) =>{
        try {
            let item = await Anhs.findById(req.params.id);
            let path_delete = path.join(__dirname, `../upload/` + item.url);
                if (fs.existsSync(path_delete)) {
                    fs.unlinkSync(path.join(__dirname, `../upload/` + item.url));
                    console.log(`The file ${path_delete} exists.`);
                } else {
                    console.log(`The file ${path_delete} does not exist.`);
                }
                await Anhs.findByIdAndDelete(req.params.id)
            res.status(200).json({message: "Xóa ảnh thành công"})
        } catch (error) {
            console.log("lỗi: ", error.message);
            res.status(401).json({ status: "failed", message: "Có lỗi xảy ra" });
        }
  },

  fetchImageActive: async(req, res) =>{
        try {
            let items = await Anhs.find({status: true}).sort({thutu: 1})
            res.status(200).json(items)
        } catch (error) {
            console.log("lỗi: ", error.message);
            res.status(401).json({ status: "failed", message: "Có lỗi xảy ra" });
        }
  },
   checkImportUser: async (req, res) => {
        let { data, khoi } = req.body;
       console.log(khoi)
        let nhom_list = ['Quản trị hệ thống', 'Quản trị thông thường', 'Theo dõi, thống kê'];


        try {
            let i = 1;
            let err = false;
            let text = "";
            let id_list = [];

            // for (let item of data) {
            //     let item_db = {
            //         ...item,
            //         matkhau: "123456",
            //         trangthai: true, 
            //     };

            //     const validation = new Users(item_db);       
            //     // await validation.save()
            //     id_list.push(validation._id);
            //     try {
            //         await validation.validate() //kiểm tra xem có hợp lệ với model hay không
               
            //             let check_taikhoancap = item.captaikhoan === "Cấp Phòng" || item.captaikhoan === "Cấp Xã";
          
            //             if (!check_taikhoancap) {
            //                 err = true;
            //                 text = 'Dữ liệu không hợp lệ tại dòng thứ ' + i + ". Trường captaikhoan không hợp lệ. Vui lòng kiểm tra lại."
            //                 break;
            //             };

            //         //check nhóm theo chức năng chấm điểm của tài khoản

            //         let check_nhom = nhom_list.includes(item.vaitro);
            //         if (!check_nhom) {
            //             err = true;
            //             text = 'Dữ liệu không hợp lệ tại dòng thứ ' + i + ". Trường vai trò không hợp lệ. Vui lòng kiểm tra lại."
            //             break;
            //         };

            //         i++;
            //         await validation.save()

            //     } catch (error) {
            //         let x = error.message
            //         if (error.message.includes("E11000 duplicate key error collection: thiduakhenthuong.users index")) {
            //             x = error.message.replace('Chi tiết lỗi: E11000 duplicate key error collection: thiduakhenthuong.users index', "Trùng giá trị đưa vào hệ thống tại trường:")
            //         }
            //         // console.error('Dữ liệu không hợp lệ tại dòng thứ ' + i +". Vui lòng kiểm tra lại file import theo đúng cấu trúc", error.message);
            //         err = true;
            //         text = 'Dữ liệu không hợp lệ tại dòng thứ ' + i + ". Vui lòng kiểm tra lại file import theo đúng cấu trúc" + x;
      
            //         break;
            //     }
            // };

            if (err) {
                await Users.deleteMany({
                    _id: { $in: id_list }
                });      
            }

            await saveAction(req.userId.userId, `Import danh sách tài khoản thành công`)
            res.status(200).json({ message: "Import dữ liệu thành công!" })
        } catch (error) {
            console.log("lỗi: ", error.message);
            res.status(401).json({ status: "failed", message: "Có lỗi xảy ra. Vui lòng kiểm tra lại file import hoặc liên hệ quản trị hệ thống" });
        }
    },
};
