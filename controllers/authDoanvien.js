const jwt = require("jsonwebtoken");
const RefreshTokens = require("../models/RefreshToken");
const Users = require("../models/UsersDoanvien");
const _ = require('lodash');
const Hoatdongs = require("../models/Hoatdong");
module.exports = {
  login: async (req, res) => {
    try {
      let user = await Users.findOne({
        tentaikhoan: req.body.tentaikhoan,
        matkhau: req.body.matkhau,
      }).populate('roles');
      if (!user) {
        return res.status(401).json({ status: false, message: "Sai tên đăng nhập hoặc mật khẩu" });
      } else {
      //cần kiểm tra xem client có refreshtoken k nếu có thì phải kiểm tra db và xóa đi khi login thành công và tạo mới refreshtoken
      let refreshTokenCookie = req.cookies.refreshToken;
      if(refreshTokenCookie){
        await RefreshTokens.findOneAndDelete({refreshToken: refreshTokenCookie})
      };

        //generate accessToken, refreshToken
        const accessToken = jwt.sign({ userId: user._id }, "vuvantinh_accessToken",{
          expiresIn: '15d'
        });


        const refreshToken = jwt.sign({ userId: user._id }, "vuvantinh_refreshToken",{
          expiresIn: '30d'
        });

        let newItem = new RefreshTokens({
          refreshToken
        });
        await newItem.save();

        let rolesArr = [];
        user.roles.forEach(i => {
            rolesArr = rolesArr.concat(i.roles)
        });

        let roles = _.uniqWith(rolesArr, _.isEqual);
        res.status(200).json({ status: "success",_id:user._id, tentaikhoan: user.tentaikhoan, roles, accessToken, refreshToken });
      }
    } catch (error) {
      console.log(error.message)
      res.status(401).json({ status: "failed", message: "Lỗi đăng nhập hệ thống" });
    }
  },
  logout: async(req, res) => {
    //xóa refreshTonken trong database
    let refreshTokenCookie = req.cookies.refreshToken;
    try {
      if(refreshTokenCookie){
        await RefreshTokens.findOneAndDelete({refreshToken: refreshTokenCookie})
      };

      //xóa cookie
      // res.clearCookie('refreshToken_px01');
      res.status(200).json({status: "success",message: "Đăng xuất thành công"})
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({ status: "failed", message: "Lỗi server hệ thống" });
    }
  },
  getUserList: async (req, res) => {
    try {
      let users = await Users.find().populate('quantrinhomdonvi').populate('quantrinhomchidoan').populate('roles')
      res.status(200).json(users)
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({ status: "failed", message: "Có lỗi xảy ra khi lấy dữ liệu người dùng" });
    }
  },
  addUser: async(req, res) => {
    let {tentaikhoan, matkhau, roles, quantrinhomdonvi, quantrinhomchidoan} = req.body;
    roles = roles.map(i=>i.value)
    quantrinhomchidoan = quantrinhomchidoan.map(i=>i.value)
    quantrinhomdonvi = quantrinhomdonvi.map(i=>i.value)
    try {
      let newItem = new Users({
        tentaikhoan,
        matkhau,
        roles: roles,
        quantrinhomdonvi: quantrinhomdonvi,
        quantrinhomchidoan: quantrinhomchidoan
      });
      await newItem.save();
      let users = await Users.find().populate('quantrinhomdonvi').populate('quantrinhomchidoan').populate('roles');
      res.status(200).json({status: "success", users, message: "Thêm tài khoản người dùng thành công"})
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({ status: "failed", message: "Có lỗi xảy ra khi thêm mới người dùng" });
    }
  },
  editUser: async (req, res) => {
    let id = req.params.id;
    let {tentaikhoan, matkhau, roles, quantrinhomdonvi, quantrinhomchidoan} = req.body;
    roles = roles.map(i=>i.value)
    quantrinhomchidoan = quantrinhomchidoan.map(i=>i.value)
    quantrinhomdonvi = quantrinhomdonvi.map(i=>i.value)
    try {
      await Users.findByIdAndUpdate(id, {
        tentaikhoan,
        matkhau,
        roles: roles,
        quantrinhomchidoan,
        quantrinhomdonvi
      });
      let users = await Users.find().populate('quantrinhomdonvi').populate('quantrinhomchidoan').populate('roles')

      res.status(200).json({status: "success", users,  message: "Cập nhật tài khoản người dùng thành công"})
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({ status: "failed", message: "Có lỗi xảy ra khi cập nhật tài khoản người dùng" });
    }
  },
  deleteUser: async (req, res) => {
    let id = req.params.id;

    try {
      await Hoatdongs.deleteMany({
        user: req.userId.userId
      })
      await Users.findByIdAndDelete(id);
      let users = await Users.find().populate('quantrinhomdonvi').populate('quantrinhomchidoan').populate('roles');

      res.status(200).json({status: "success", users, message: "Xóa tài khoản người dùng thành công"})
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({ status: "failed", message: "Có lỗi xảy ra khi xóa người dùng" });
    }
  },

  requestRefreshToken: async (req, res) => {
    // console.log(req.cookies)
    const refreshToken = req.cookies.refreshToken_quanlydoanvien;
    // console.log(refreshToken)
    if(!refreshToken){
      return res.status(401).json({message: 'Token không tồn tại. Vui lòng đăng nhập'})
    };
    // console.log(refreshToken)
    // kiểm tra xem trong db có refreshtoken này không nếu k có thì là k hợp lệ
    const checkRefreshTokenInDb = await RefreshTokens.findOne({refreshToken});
    // console.log('token',checkRefreshTokenInDb)
    // console.log(checkRefreshTokenInDb)
    if(!checkRefreshTokenInDb) return res.status(403).json({message: "Token không hợp lệ"});

    jwt.verify(refreshToken, "vuvantinh_refreshToken", async (err, user) => {
      if(err){
        console.log(err.message)
      };

      const newAccessToken = jwt.sign({ userId: user.userId }, "vuvantinh_accessToken",{
        expiresIn: '15d'
      });

      const newRefreshToken = jwt.sign({ userId: user.userId }, "vuvantinh_refreshToken",{
        expiresIn: '30d'
      });

      await RefreshTokens.findOneAndDelete({refreshToken: refreshToken})
      // thêm refreshtoken mới vào db sau đó trả về client accesstoken mới
      let newItem = new RefreshTokens({
        refreshToken: newRefreshToken
      });
      await newItem.save()
      res.status(200).json({accessToken: newAccessToken, refreshToken: newRefreshToken})
      console.log('ok')
    })
  },
  changePassword: async (req, res) => {
    let { id, matkhaucu, matkhaumoi} = req.body;
    try {
      let user = await Users.findOne({_id: id,matkhau: matkhaucu});
      if(!user){
        res.status(401).json({message: "Mật khẩu cũ không chính xác. Vui lòng kiểm tra lại"})
        return;
      }

      user.matkhau = matkhaumoi;
      await user.save();
      res.status(200).json({message: "Đổi mật khấu thành công. Vui lòng đăng nhập lại."})
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({ status: "failed", message: "Lỗi server, Vui lòng liên hệ quản trị hệ thống" });
    }
  },

  
};
