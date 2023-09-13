import React, { useRef } from 'react'
import { useState, useEffect } from 'react'
import '../../components/style/Chat.css'
import useAuth from '../../hooks/useAuth'
import { useGetUserChatsQuery } from './chatsApiSlice'
import Conversation from './Conversation'
import Chatbox from './Chatbox'
import { io } from 'socket.io-client'

/*
    When use click messages (in the UI), they will be prompt to this Chat component
*/
const Chat = () => {

    // If user is login, we will be able to obtain a userId through the use of our useAuth hook
    const { userId } = useAuth()

    const socket = useRef() // Serves as a reference for the socket, so that we can use the value
    
    const [chats, setChats] = useState([]) // set the chats, in our case is an array of chat
    const [currentChat, setCurrentChat] = useState(null) // Set it to the currentChat, if clicked
    const [onlineUsers, setOnlineUsers] = useState([]) // Check to see if who online and set it
    const [receiveMessage, setReceiveMessage] = useState(null) // Receive message from the socket.io and set it
    const [sendMessage, setSendMessage] = useState(null)

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showChatLeft, setShowChatLeft] = useState(true);


    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    const showChatRight = (chat) => {
        setCurrentChat(chat);
        setShowChatLeft(false); // Set to false to hide chat-left
    };

    // users - useGetAvailableUsers with respect to the user
    const { data: userChats,
            isLoading: chatsLoading,
            isSuccess: chatsSuccess,
            isError: chatsError,
            error: chatsErrorMsg } = useGetUserChatsQuery({ userId })

    // Set up the connection such that we can communicate with the socket.io (in the backend)
    useEffect(() => {
        socket.current = io('http://localhost:8800')
        socket.current.emit('new-user-add', userId)
        socket.current.on('get-users', (users) => {
            setOnlineUsers(prevUsers => [...users]) // Update the state based on previous state
        })
    }, [userId])

    // Send Message to socket server
    // we use .emit if we want to run the event, for our case send-message
    useEffect(() => {
        if (sendMessage !== null) {
            console.log("defug?: ", sendMessage)
            socket.current.emit("send-message", sendMessage)
        }
    }, [sendMessage]);
    
    // Get the message from socket server
    useEffect(() => {
        socket.current.on("receive-message", (data) => {
            console.log("Data receive in parent Chat.js: ", data)
            setReceiveMessage(data);
        })
    }, [])

    // Get the chat in chat section and SET IT
    useEffect(() => {
        if (chatsSuccess) {
            setChats(userChats)
        }
    }, [chatsSuccess, userChats])

    // A variable that helps to control when to hide the chatbox-msg-container
    // let windowWidth = window.innerWidth;

    return (
        <div id="chat-container">
            {/* <div id={`${currentChat !== null ? 'hide' : 'chat-left'}`}> */}
            <div className={`chat-left ${((showChatLeft || !showChatLeft) && (currentChat === null || currentChat !== null) && windowWidth > 762)
                || (showChatLeft && currentChat === null && windowWidth < 762) ? '' : 'chat-left-hide'}`}>
                <h2>Chats</h2>
                <div id="chat-list">
                    {chats.map((chat) => (
                        <div key={chat._id} onClick={() => showChatRight(chat)}>
                            <Conversation data={chat} currentUserId = {userId} />
                        </div>
                    ))}
                </div>
            </div>
            <div className={`chat-right ${((showChatLeft || !showChatLeft) && (currentChat === null || currentChat !== null) && windowWidth > 762)
                || (!showChatLeft && currentChat !== null && windowWidth < 762) ? '' : 'chat-right-hide'}`}>
                <Chatbox chat={currentChat} currentUserId={userId} setSendMessage={setSendMessage} receiveMessage={receiveMessage} setCurrentChat={setCurrentChat} setShowChatLeft={setShowChatLeft}/>
            </div>
        </div>
    )
}

export default Chat
