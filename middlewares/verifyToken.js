const jwt = require("jsonwebtoken");

const middlewareController = {
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    // console.log(token)
    if (token) {
      const accessToken = req.headers.token.split(" ")[1];
      jwt.verify(accessToken, 'vuvantinh_accessToken', (err, user) => {
        if (err) {
          console.log(err.message)
          return res.status(403).json({message: "Token đã hết hạn, vui lòng đăng nhập lại"}); // 403 trạng thái máy chủ đã xác nhận nhưng k được phép
        }
        req.userId = user;
        next();
      });
    } else {
      return res.status(401).json({message: "You are not authenticated"});
    }
  },
};

module.exports = middlewareController;
