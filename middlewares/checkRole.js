const Users = require("../models/Users");
const _ = require('lodash');

let checkRole = (role) => {
    return async (req, res, next) => {
        let userId = req.userId.userId;

        const user = await Users.findOne({ _id: userId }).populate('roles');

        if (user === null) {
            res.status(403).json({ message: "Tài khoản không tồn tại, vui lòng đăng nhập lại" })
        } else {
            let rolesArr = [];
            user.roles.forEach(i => {
                rolesArr = rolesArr.concat(i.roles)
            });
            req.user = user;
            
            let roles = _.uniqWith(rolesArr, _.isEqual);
            let checkedRole = roles.includes(role);
            
            if (!checkedRole) {
                res.status(401).json({ message: `Tài khoản không có quyền ${role}, vui lòng đăng nhập tài khoản có chức năng này!` });
                return;
            };

            next();
        }
    }
}

module.exports = checkRole;