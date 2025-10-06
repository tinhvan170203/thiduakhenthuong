const express = require('express');

const router = express.Router();
const checkRole = require('../middlewares/checkRole');
const middlewareController = require('../middlewares/verifyToken');
const canbo = require('../controllers/canbo');

router.get('/initial', middlewareController.verifyToken, canbo.dataForAddPerson);
router.get('/change-doi-of-don-vi', middlewareController.verifyToken, canbo.getDoiWhenDonviChange);
router.post('/add', middlewareController.verifyToken, canbo.addPerson);
router.get('/dang-vien-list/fetch', middlewareController.verifyToken, canbo.getDoanvienList)
router.put('/edit', middlewareController.verifyToken, canbo.editPerson);
router.put('/chuyen-cong-tac/:id', middlewareController.verifyToken, canbo.chuyenCongtac);
router.put('/change/bac-ham', middlewareController.verifyToken, canbo.changeBacham)
router.put('/change/chuc-vu', middlewareController.verifyToken, canbo.changeChucvu)
router.delete('/delete/:id', middlewareController.verifyToken, canbo.deletePersonLevel1);
router.get('/fetch/year-month', middlewareController.verifyToken, canbo.getYearMonth);
router.get('/chuc-vu-nang-cao/:id', middlewareController.verifyToken, canbo.getChucvuPlus);
router.put('/chuc-vu-nang-cao/:id/:id1',middlewareController.verifyToken, canbo.changeChucvuAdvanced)
router.delete('/chuc-vu-nang-cao/:id/:id1',middlewareController.verifyToken, canbo.deleteChucvuAdvanced)
router.get('/bac-ham-nang-cao/:id', middlewareController.verifyToken, canbo.getBachamPlus);
router.put('/bac-ham-nang-cao/:id/:id1',middlewareController.verifyToken, canbo.changeBachamAdvanced)
router.delete('/bac-ham-nang-cao/:id/:id1',middlewareController.verifyToken, canbo.deleteBachamAdvanced)
router.get('/yeu-cau-tiep-nhan', middlewareController.verifyToken, canbo.fetchCanboYeucauTiepnhan);
router.get('/don-vi-nang-cao/:id', middlewareController.verifyToken, canbo.getDonviPlus);
router.put('/don-vi-nang-cao/:id/:id1',middlewareController.verifyToken,  canbo.changeDonviPlus)
router.put('/truong-thanh-doan/:id', middlewareController.verifyToken, canbo.uptoNghihuu);

//thiduathang
router.get('/fetch/year-month', middlewareController.verifyToken, canbo.getYearMonth);
router.get('/fetch/thi-dua-thang', middlewareController.verifyToken, canbo.fetchThiduathang);
router.put('/update/thi-dua-thang', middlewareController.verifyToken,  canbo.saveThiduathang);
router.get('/fetch/thi-dua-nam', middlewareController.verifyToken, canbo.fetchThiduanam);
router.put('/update/thi-dua-nam',middlewareController.verifyToken,  canbo.saveThiduanam);
router.get('/fetch/xep-loai-dang-vien', middlewareController.verifyToken, canbo.fetchXeploaidangvien);
router.put('/update/xep-loai-dang-vien',middlewareController.verifyToken,  canbo.saveXeploaidangvien);

router.get('/list/delete', middlewareController.verifyToken, canbo.getCanboStatusDelete);
router.delete('/delete/advanced/:id', middlewareController.verifyToken, canbo.deleteCanboPlus);
router.get('/change-active/:id', middlewareController.verifyToken, canbo.changeActiveDoanvien);


router.get('/detail-doan-vien/:id', middlewareController.verifyToken, canbo.detailDoanvien);
router.get('/donvikhactinh', middlewareController.verifyToken, canbo.getDonviNgoaitinh);
router.put('/chuyencongtackhactinh/:id',middlewareController.verifyToken,  canbo.moveDiaphuongkhac);
router.get('/doan-vien-ngoai-tinh', middlewareController.verifyToken, canbo.getDoanvienChuyenKhactinh);
router.get('/chuyen-ve-tinh/:id', middlewareController.verifyToken, canbo.backToCongantinh);

// sửa mới 2025
router.put('/tu-choi-tiep-nhan',middlewareController.verifyToken,  canbo.tuchoiYeucauTiepnhan);
router.put('/dong-y-tiep-nhan',middlewareController.verifyToken,  canbo.dongyYeucauTiepnhan);
router.put('/quay-ve-don-vi',middlewareController.verifyToken,  canbo.backtoDonvi);
router.get('/list-tu-choi', middlewareController.verifyToken, canbo.fetchListBiTuchoi);
router.put('/chuyen-trong-co-quan',middlewareController.verifyToken,  canbo.chuyenCongtacTrongCoquan);
router.put('/chuyen-cong-tac-multiple',middlewareController.verifyToken,  canbo.chuyenCongtacMultiple);

router.get('/can-bo-tung-cong-tac/fetch', middlewareController.verifyToken, canbo.fetchCanboDatungCongtac);
router.get('/can-bo-dang-doi-chuyen-cong-tac/fetch', middlewareController.verifyToken, canbo.fetchListCanboDangChoXacnhanChuyenCtac);
module.exports = router