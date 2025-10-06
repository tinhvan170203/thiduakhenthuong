const express = require('express');

const router = express.Router();
const middlewareController = require('../middlewares/verifyToken');
const khoi = require('../controllers/khoi');

router.get('/fetch',middlewareController.verifyToken, khoi.getKhois);
router.post('/add',middlewareController.verifyToken,  khoi.addKhoi);
router.put('/edit/:id',middlewareController.verifyToken, khoi.updateKhoi);
router.delete('/delete/:id',middlewareController.verifyToken, khoi.deleteKhoi);


module.exports = router