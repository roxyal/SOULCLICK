require('dotenv').config()
require('express-async-errors') // help you handle the try n catch errors

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
const cors = require('cors')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500

const io = require('socket.io')(8800, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)

app.use(cors(corsOptions))

let activeUsers = []

// io.on - is an active Event
io.on('connection', (socket) => {
    // add New user
    /*
        Input - newUserId
        Output - When the server receives a "new-user-add" event from the client 
        (socket.on('new-user-add', ...)), it expects the client to provide a newUserId
        The server checks if there is already an active user with the same userId.
        If not, it adds the new user to the activeUsers list by pushing an object
        with the userId and the socketId of the connecting socket.
    */
    socket.on('new-user-add', (newUserId) => { 
        // if new user then we push it into the activeUsers list
        if (!activeUsers.some((user) => user.userId === newUserId)) {
          activeUsers.push({
            userId: newUserId,
            socketId: socket.id
          })
        }
        console.log("[CONNECTED] Remaining ActiveUsers: ", activeUsers)
        io.emit('get-users', activeUsers)
    })

    // send message
    /*
        Input - data (that contain the receiverId)
        Output - When a user emits a 'send-message' event from the client, the server
        receives the event with the associated data. The data should include a
        receiverId field specifying the intended recipient of the message.
        
        The server then searches the activeUsers list to find the user object that matches
        the receiverId. If a matching user is found, the server uses
        io.to(user.socketId).emit('receive-message', data) to send the 'receive-message' event
        along with the provided data to the targeted client identified by their socketId.
    */
    socket.on('send-message', (data) => {
        const { receiverId } = data
        const user = activeUsers.find((user) => user.userId === receiverId);
        console.log("user: ", user)
        console.log("[Sending from socket to]: ", receiverId)
        console.log("Data: ", data)
        if (user) {
            console.log("Data is sending ......: ", user.socketId)
            io.to(user.socketId).emit('receive-message', data)
        }
    })
    /*
        Remove the disconnected user from the activeUsers array, takes in an argument of the userId
    */
    socket.on('disconnect-user', (userId) => {
        const index = activeUsers.findIndex(user => user.userId === userId);
        
        // If not equals to -1 which means, user is found in the activeUsers array, then we remove
        if (index !== -1) {
            activeUsers.splice(index, 1);
        }

        console.log("[DISCONNECTED] Remaining ActiveUsers: ", activeUsers)
        io.emit('get-users', activeUsers) //update the get-users
    }) 
})


// Set the limit to 50MB (because nodeJS default only 1MB)
// We have a feature to upload PHOTO, thus need more MB
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))

// Adding the API routes
app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/chat', require('./routes/chatRoutes'))
app.use('/message', require('./routes/messageRoutes'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})