import React, { useRef, useEffect, useState } from 'react'
import { useGetUsersQuery } from '../users/usersApiSlice'
import { useGetMessagesQuery } from '../message/messagesApiSlice'
import { format } from 'timeago.js'
import InputEmoji from 'react-input-emoji'
import { useAddMessageMutation } from '../message/messagesApiSlice'

/*
    Chatbox - when you select the person you want to talk to, it will trigger this component
    Input - chat (object), currentUserId (YOU), setSendMessage (to set the sendMessage to the socket.io)
            Using this receiveMessage to update the messages (such that it can be in real time)
*/
const Chatbox = ({ chat, currentUserId, setSendMessage,  receiveMessage, setCurrentChat, setShowChatLeft }) => {

    const [userData, setUserData] = useState(null) // set the userData when user object is mounted
    const [messages, setMessages] = useState([]) // a variable to update the messages
    const [newMessages, setNewMessages] = useState("") // a variable to udpate the messages the user type
    const [chatOpen, setChatOpen] = useState(false) // a variable to control the opening of the chat

    const scroll = useRef();
    const userId = chat?.members?.find((id) => id !== currentUserId)

    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        }),
    })

    // Receive Message from parent component, such that we can set the receive message to the
    // setMessages (to display the real time communication)
    useEffect(()=> {
        console.log("Message Arrived: ", receiveMessage)
        if (receiveMessage !== null && receiveMessage.chatId === chat._id) {
            console.log("Data receive in Child Chatbox.js: ", receiveMessage)
            setMessages([...messages, receiveMessage]);
        }
    },[receiveMessage])

    // Always scroll to last Message
    useEffect(()=> {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    },[messages])

    // set the userData when user object is mounted
    useEffect(() => {
        if (chat && currentUserId) {
            setUserData(user)
        }
    }, [chat, currentUserId])

    // getMessages from the backend API endpoints
    const { data: msgData,
        isLoading: msgLoading,
        isSuccess: msgSuccess,
        isError: msgError,
        error: msgErrorMsg } = useGetMessagesQuery({ chatId: chat?._id })

    // addMessage send by the user to the database
    const [addMessage, {
        isLoading: addMsgLoading,
        isSuccess: addMsgSuccess,
        isError: addMsgError,
        error: addMsgErrorMsg
    }] = useAddMessageMutation()

    // If mounted set the msgData to the setMessages 
    useEffect(() => {
        if (msgSuccess) {
            setMessages(msgData)
        }
    }, [msgSuccess, msgData])

    // onEmojiChanged - set the new messages with respesto the emoji text input
    const onEmojiChanged = (newMessages) => {
        setNewMessages(newMessages)
    }
    
    // onSendClicked - once clicked it will trigger the addMessage as well as setting the
    // {...message, receiverId} back to the parent component
    const onSendClicked = async (e) => {
        e.preventDefault()
        const message = { chatId: chat._id, senderId: currentUserId, text: newMessages}
        const receiverId = chat.members.find((id) => id !== currentUserId);
    
        // AddMessage to the database
        const { data } = await addMessage(message)
        setMessages([...messages, data]) // this means we update the data into the messages
        setNewMessages("") // Clear the text input to empty string

        // send message to socket server
        setSendMessage({...message, receiverId})
    }

    const showChatLeftAgain = () => {
        setShowChatLeft(true)
        setCurrentChat(null)
    }
    
    return (
        <div id="chatbox-container">
            {chat ? 
            (
                <>
                    <div id="chatbox-header">
                        <h2 className="chat-right-back-btn" onClick={showChatLeftAgain}>&lt;</h2>
                        <img src={userData?.myFile} alt="" />
                        <span>{userData?.name}</span>
                    </div>
                    <div id="chatbox-msg-container">
                        <div id="chatbox-msg">
                            {messages.map((message) => (
                                <div 
                                    key={message._id}
                                    ref={scroll}
                                    className={`message-bubble ${message.senderId === currentUserId ? 'right' : 'left'}`}
                                    >
                                    <span>{message.text}</span>
                                    <span className="msg-bubble-createdAt">{format(message.createdAt)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div id="chat-send">
                        <div id="chat-send-attachment">+</div>
                        <InputEmoji 
                            value={newMessages}
                            onChange={onEmojiChanged}
                        />
                        <div id="chat-send-btn" onClick={onSendClicked}>Send</div>
                    </div>
                </>
            )
            :
            (
                <span id="chatbox-empty-msg">Tap them to start Conversation 💕</span>
            )
            }
        </div>
    )
}
export default Chatbox