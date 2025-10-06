const express = require('express');

const router = express.Router();
const checkRole = require('../middlewares/checkRole');
const middlewareController = require('../middlewares/verifyToken');
const thongke = require('../controllers/thongke');

router.get('/khen-thuong/fetch', middlewareController.verifyToken, thongke.getKhenthuongs);
router.get('/khen-thuong-theo-thoi-gian/fetch', middlewareController.verifyToken, thongke.getKhenthuongsTheoThoigian);
router.get('/ki-luat/fetch', middlewareController.verifyToken, thongke.getKiluats);
router.get('/thi-dua-thang/fetch', middlewareController.verifyToken, thongke.getThiduathangs);
router.get('/thi-dua-thang-dang-cong-tac/fetch', middlewareController.verifyToken, thongke.getThiduathangsTheoNam);
router.get('/bang-thi-dua-thang/fetch', middlewareController.verifyToken, thongke.getBangtheodoiThiduathang);
router.get('/thi-dua-nam/fetch', middlewareController.verifyToken, thongke.getThiduanams);
router.get('/bang-thi-dua-nam/fetch', middlewareController.verifyToken, thongke.getBangThiduanam);
router.get('/truong-thanh-doan/fetch', middlewareController.verifyToken, thongke.getTruongthanhdoans);
router.get('/truong-thanh-doan/change/:id', middlewareController.verifyToken, thongke.changeStatusTruongthanhdoan);
router.get('/danh-sach-don-vi-doi/fetch', middlewareController.verifyToken, thongke.getUserUseVaitro);
router.get('/xep-loai-dang-vien/fetch', middlewareController.verifyToken, thongke.getXeploaiDangvienNam);
router.get('/bang-xep-loai-dang-vien/fetch', middlewareController.verifyToken, thongke.getBangXeploaiDangvienQuaCacNam);
router.get('/danh-hieu-thi-dua/fetch', middlewareController.verifyToken, thongke.getDanhhieuThiduaThongke);
router.get('/number-can-bo-dang-vien-dang-cong-tac/fetch', middlewareController.verifyToken, thongke.getNumberCanboOrDangvienDangCongtac);
router.get('/number-khen-thuong-ki-luat-dang-cong-tac/fetch', middlewareController.verifyToken, thongke.getNumberKhenthuongs);

router.get('/fetch/system-history', middlewareController.verifyToken, thongke.fetchLichsuHethong)
router.get('/fetch/don-vi-chua-save-thi-dua-thang', middlewareController.verifyToken, thongke.reportDonviChuaSaveThiduathang)
router.get('/search/can-bo', middlewareController.verifyToken, thongke.searchCanbo)
module.exports = router