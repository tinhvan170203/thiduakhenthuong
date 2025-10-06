const express = require('express');

const router = express.Router();
const checkRole = require('../middlewares/checkRole');
const middlewareController = require('../middlewares/verifyToken');
const donvi = require('../controllers/donvi');

router.get('/fetch',middlewareController.verifyToken, donvi.getDonvis);
router.post('/add',middlewareController.verifyToken, checkRole("thêm mô hình tổ chức"), donvi.addDonvi);
router.put('/edit/:id',middlewareController.verifyToken,checkRole("sửa mô hình tổ chức"), donvi.updateDonvi);
router.delete('/delete/:id',middlewareController.verifyToken,checkRole("xóa mô hình tổ chức"), donvi.deleteDonvi);


module.exports = router