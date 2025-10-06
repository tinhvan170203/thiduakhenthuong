const express = require('express');

const router = express.Router();
const middlewareController = require('../middlewares/verifyToken');
const hinhthuckhen = require('../controllers/hinhthuckhen');

router.get('/fetch',middlewareController.verifyToken, hinhthuckhen.getHinhthuckhens);
router.post('/add',middlewareController.verifyToken,  hinhthuckhen.addHinhthuckhen);
router.put('/edit/:id',middlewareController.verifyToken, hinhthuckhen.updateHinhthuckhen);
router.delete('/delete/:id',middlewareController.verifyToken, hinhthuckhen.deleteHinhthuckhen);


module.exports = router