const express = require('express');

const router = express.Router();

const checkRole = require('../middlewares/checkRole');
const middlewareController = require('../middlewares/verifyToken');

const bacham = require('../controllers/bacham');

router.get('/fetch',middlewareController.verifyToken,  bacham.getBachams);
router.post('/add',middlewareController.verifyToken, bacham.addBacham);
router.put('/edit/:id',middlewareController.verifyToken,  bacham.updateBacham);
router.delete('/delete/:id',middlewareController.verifyToken, bacham.deleteBacham);


module.exports = router