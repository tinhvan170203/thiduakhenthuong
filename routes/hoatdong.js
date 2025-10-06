const express = require('express');

const router = express.Router();
const checkRole = require('../middlewares/checkRole');
const middlewareController = require('../middlewares/verifyToken');
const hoatdong = require('../controllers/hoatdong');

router.get('/fetch',middlewareController.verifyToken, hoatdong.getHoatdongs);
router.get('/search',middlewareController.verifyToken, hoatdong.searchHoatdong);
router.post('/add',middlewareController.verifyToken,  hoatdong.addHoatdong);
router.put('/edit/:id',middlewareController.verifyToken, hoatdong.updateHoatdong);
router.delete('/delete/:id',middlewareController.verifyToken, hoatdong.deleteHoatdong);


module.exports = router