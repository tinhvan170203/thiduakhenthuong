const express = require('express');

const router = express.Router();
const checkRole = require('../middlewares/checkRole');
const middlewareController = require('../middlewares/verifyToken');
const chucvu = require('../controllers/chucvu');

router.get('/fetch',middlewareController.verifyToken, chucvu.getChucvus);
router.post('/add',middlewareController.verifyToken,  chucvu.addChucvu);
router.put('/edit/:id',middlewareController.verifyToken, chucvu.updateChucvu);
router.delete('/delete/:id',middlewareController.verifyToken, chucvu.deleteChucvu);


module.exports = router