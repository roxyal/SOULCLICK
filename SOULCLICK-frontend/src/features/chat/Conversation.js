import React, { useState, useEffect } from 'react'
import { useGetUsersQuery } from '../users/usersApiSlice'

const Conversation = ({ data, currentUserId }) => {

    const [userData, setUserData] = useState(null)

    const userId = data.members.find((id) => id !== currentUserId)
    
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        }),
    })
    useEffect(() => {
        if (user) {
            setUserData(user)
        }
    }, [user])
    
    return (
        <div id="chat-conversation">
            <img src={userData?.myFile} alt="" />
            <span>{userData?.name}</span>
        </div>
    )
}
export default Conversation