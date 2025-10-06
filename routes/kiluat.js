const express = require('express');

const router = express.Router();
const checkRole = require('../middlewares/checkRole');
const middlewareController = require('../middlewares/verifyToken');
const kiluat = require('../controllers/kiluat');


router.get('/ca-nhan/:id/fetch',middlewareController.verifyToken, kiluat.getKiluatcanhan);
router.post('/ca-nhan/add',middlewareController.verifyToken, kiluat.addKiluatcanhan);
router.put('/ca-nhan/edit/:id',middlewareController.verifyToken, kiluat.editKiluatcanhan);
router.delete('/ca-nhan/delete/:id',middlewareController.verifyToken, kiluat.deleteKiluatcanhan);

router.get('/ca-nhan/:id/search',middlewareController.verifyToken, kiluat.searchKiluatcanhan);
module.exports = router