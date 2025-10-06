const express = require('express');

const router = express.Router();
const middlewareController = require('../middlewares/verifyToken');
const capkhenthuong = require('../controllers/capkhenthuong');

router.get('/fetch',middlewareController.verifyToken, capkhenthuong.getCapkhenthuongs);
router.post('/add',middlewareController.verifyToken,  capkhenthuong.addCapkhenthuong);
router.put('/edit/:id',middlewareController.verifyToken, capkhenthuong.updateCapkhenthuong);
router.delete('/delete/:id',middlewareController.verifyToken, capkhenthuong.deleteCapkhenthuong);


module.exports = router