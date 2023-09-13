const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatController')

router.route('/createChat')
    .post(chatController.createChat)

router.route('/getChats')
    .post(chatController.getUserChats)

router.route('/findChat')
    .post(chatController.findChat)

module.exports = router