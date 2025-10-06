const express = require('express');

const router = express.Router();
const checkRole = require('../middlewares/checkRole');
const middlewareController = require('../middlewares/verifyToken');
const doi = require('../controllers/doi');

router.get('/fetch',middlewareController.verifyToken,  doi.getDois);
router.post('/add',middlewareController.verifyToken, doi.addDoi);
router.put('/edit/:id',middlewareController.verifyToken, doi.updateDoi);
router.delete('/delete/:id',middlewareController.verifyToken, doi.deleteDoi);


module.exports = router