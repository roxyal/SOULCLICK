const Chat = require('../models/chat')

// @desc Get all users
// @route GET /users
// @access Private

const createChat = async (req, res) => {
    const { senderId, receiverId } = req.body

    const chatObject = { members: [senderId, receiverId]}

    // Create and the store the chat into our database
    const chat = await Chat.create(chatObject)

    // if there are no chat created
    if (chat) { // User created successfully
        res.status(201).json({ message: `Chat for senderId: ${senderId} & receiverId: ${receiverId} created successfully`})
    }
    else {
        res.status(400).json({ message: `Invalid Chat creation`})
    }
    res.json(chat)
}

const getUserChats = async (req, res) => {
    const { userId } = req.body

    const chat = await Chat.find({
        members: {$in: [userId]}
    })

    // if there are no chat created
    if (!chat) { // User created successfully
        res.status(400).json({ message: `Invalid retrieved of Chat`})
    }
    res.json(chat)
}

const findChat = async (req, res) => {
    const { senderId, receiverId } = req.body
    const chat = await Chat.findOne({
        members: {$all: [senderId, receiverId]}
    })
    if (!chat) { // User created successfully
        res.status(400).json({ message: `Invalid retrieved of Chat`})
    }
    res.json(chat)
}

module.exports = {
    createChat,
    getUserChats,
    findChat
}