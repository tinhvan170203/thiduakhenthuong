const express = require('express');

const router = express.Router();
const checkRole = require('../middlewares/checkRole');
const middlewareController = require('../middlewares/verifyToken');
const notification = require('../controllers/notification');

router.get('/fetch',middlewareController.verifyToken, notification.getNotifications);
router.post('/add',middlewareController.verifyToken, notification.addNotification);
router.put('/edit/:id',middlewareController.verifyToken,  notification.updateNotification);
router.delete('/delete/:id',middlewareController.verifyToken, notification.deleteNotification);


module.exports = router