const express = require('express');

const router = express.Router();
const checkRole = require('../middlewares/checkRole');
const middlewareController = require('../middlewares/verifyToken');
const khenthuong = require('../controllers/khenthuong');

router.get('/tap-the/fetch',middlewareController.verifyToken, khenthuong.getKhentapthes);
router.post('/tap-the/add',middlewareController.verifyToken, khenthuong.addKhentapthe);
router.put('/tap-the/edit/:id',middlewareController.verifyToken, khenthuong.updateKhentapthe);
router.delete('/tap-the/delete/:id',middlewareController.verifyToken, khenthuong.deleteKhentapthe);

router.get('/ca-nhan/:id/fetch',middlewareController.verifyToken, khenthuong.getKhencanhan);
router.post('/ca-nhan/add',middlewareController.verifyToken, khenthuong.addKhencanhan);
router.put('/ca-nhan/edit/:id',middlewareController.verifyToken, khenthuong.editKhencanhan);
router.delete('/ca-nhan/delete/:id',middlewareController.verifyToken, khenthuong.deleteKhencanhan);

router.get('/ca-nhan/:id/search',middlewareController.verifyToken, khenthuong.searchKhencanhan);

router.get('/danh-hieu-thi-dua/fetch',middlewareController.verifyToken, khenthuong.getDanhhieuthiduas);
router.post('/danh-hieu-thi-dua/add',middlewareController.verifyToken, khenthuong.addDanhhieuthidua);
router.put('/danh-hieu-thi-dua/edit/:id',middlewareController.verifyToken, khenthuong.updateDanhhieuthidua);
router.delete('/danh-hieu-thi-dua/delete/:id',middlewareController.verifyToken, khenthuong.deleteDanhhieuthidua);

module.exports = router