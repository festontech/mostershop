const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuth } = require('../middleware/auth');

// GET routes
router.get('/login', authController.getLoginPage);
router.get('/register', authController.getRegisterPage);
router.get('/profile', isAuth, authController.getProfilePage);
router.get('/logout', authController.logout);

// POST routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/update-profile', isAuth, authController.updateProfile);

module.exports = router;