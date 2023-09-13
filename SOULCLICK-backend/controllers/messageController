const Message = require('../models/message')

const addMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body
    const messageObj = { chatId, senderId, text }

    const message = await Message.create(messageObj)

    if (!message) { // Message add successfully
        res.status(400).json({ message: `Unable to add message successfully`})
    }
    res.json(message)
}

const getMessages = async (req, res) => {
    const { chatId } = req.body

    const result = await Message.find({ chatId })
 
    if (!result) { // Message add successfully
        res.status(400).json({ message: `Unable to find any chat related to ${chatId}`})
    }
    res.json(result)
}
module.exports = {
    addMessage,
    getMessages
}
