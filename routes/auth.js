const express = require('express');
const multer = require('multer')
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname,`../upload`))
    },
    filename: function(req, file, cb) {
        const originalName = file.originalname; // tên file gốc
        const encodedName = Buffer.from(originalName, 'latin1').toString('utf8'); // mã hóa tên file
        // cb(null, encodedName); // dùng tên file đã mã hóa
        cb(null, + new Date() + '_' + encodedName)
    }
});

const upload = multer({
    storage: storage,
});

const router = express.Router();

const auth = require('../controllers/auth');
const middlewareController = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
// const middlewareController = require('../middlewares/verifyToken');

router.post('/login', auth.login )
router.post('/change-pass', auth.changePassword )
router.get('/logout',  auth.logout)
router.get('/user/fetch',  auth.getUserList)
router.get('/user/tiep-nhan/fetch',middlewareController.verifyToken, auth.getDanhsachDonviTiepnhan)
router.get('/requestRefreshToken', auth.requestRefreshToken)
router.post('/user/add', middlewareController.verifyToken, auth.addUser)
router.delete('/user/delete/:id',middlewareController.verifyToken, auth.deleteUser)
router.put('/user/edit/:id', middlewareController.verifyToken, auth.editUser)
// router.put('/users/edit-phanquyendonvi/:id', auth.editPhanquyendonvi)
router.get('/user/get-danh-sach-user-theo-khoi', middlewareController.verifyToken, auth.getUsersOfKhoi)
router.get('/img/fetch', middlewareController.verifyToken, auth.fetchImage)
router.post('/check-import', middlewareController.verifyToken, auth.checkImportUser)
router.post('/save-img',middlewareController.verifyToken, upload.single('file'), auth.upLoadImage);
router.put('/edit-img/:id',middlewareController.verifyToken,  auth.editImage);
router.delete('/delete-img/:id',middlewareController.verifyToken,  auth.deleteImage);
router.get('/img-active/fetch', middlewareController.verifyToken, auth.fetchImageActive)
module.exports = router