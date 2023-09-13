const express = require('express')
const router = express.Router()
const loginLimiter = require('../middleware/loginLimiter')
const authController = require('../controllers/authController')

// if you just put '/' it means (routeName + '')
router.route('/')
    .post(loginLimiter, authController.login)

router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

module.exports = router