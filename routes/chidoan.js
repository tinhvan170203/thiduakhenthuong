const express = require('express');

const router = express.Router();
const checkRole = require('../middlewares/checkRole');
const middlewareController = require('../middlewares/verifyToken');
const chidoan = require('../controllers/chidoan');

router.get('/fetch',middlewareController.verifyToken, chidoan.getChidoans);
router.post('/add',middlewareController.verifyToken, checkRole("thêm mô hình tổ chức"), chidoan.addChidoan);
router.put('/edit/:id',middlewareController.verifyToken,checkRole("sửa mô hình tổ chức"), chidoan.updateChidoan);
router.delete('/delete/:id',middlewareController.verifyToken,checkRole("xóa mô hình tổ chức"), chidoan.deleteChidoan);

router.get('/get-chi-doan-of-user', middlewareController.verifyToken, chidoan.getChidoansOfUser)

module.exports = router