const express = require('express')
const router = express.Router()
const messageController = require('../controllers/messageController')

router.route('/addMessage')
    .post(messageController.addMessage)

router.route('/getMessages')
    .post(messageController.getMessages)

module.exports = router