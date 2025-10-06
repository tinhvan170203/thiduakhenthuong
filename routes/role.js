const express = require('express');

const router = express.Router();
const checkRole = require('../middlewares/checkRole');
const middlewareController = require('../middlewares/verifyToken');
const role = require('../controllers/role');

router.get('/fetch',middlewareController.verifyToken, role.getRoles);
router.post('/add',middlewareController.verifyToken, checkRole("thêm nhóm quyền"), role.addRole);
router.put('/edit/:id',middlewareController.verifyToken, checkRole("sửa nhóm quyền"), role.updateRole);
router.delete('/delete/:id',middlewareController.verifyToken, checkRole("xóa nhóm quyền"), role.deleteRole);


module.exports = router