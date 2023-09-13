import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetUsersQuery, useGetAvailableUsersQuery, useLikedUserMutation, useSkippedUserMutation } from '../../users/usersApiSlice'
import { useCreateChatMutation } from '../../chat/chatsApiSlice'
import useAuth from '../../../hooks/useAuth'
import '../../../components/style/Welcome.css'
import LoaderSpinner from '../../../UtilityPage/LoaderSpinner'
import { FcLike } from 'react-icons/fc'
import { RxCross2 } from 'react-icons/rx'
import { IconContext } from "react-icons";
import { RiGhostSmileLine } from 'react-icons/ri'

/*
    Welcome - Once user is login successfully into the page, they will be on this page they will be
    seeing on their screen
*/
const Welcome = () => {

    const navigate = useNavigate()

    // If user is login, we will be able to obtain a userId through the use of our useAuth hook
    const { userId } = useAuth()

    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        }),
    })

    /* 
        useState must always be at the top REMEMBER
        userList - Use to set the usersList (which is the useGetAvailableUsers)
        activeUserIndex - Use to control the index of the users array
        usersListSize - Use to compare activeUserIndex to check if the array has reached the end of the array
        matchedUser - Use to set if matched between two users occurs
    */
    // const [usersList, setUsersList] = useState([]) 
    const [activeUserIndex, setActiveUserIndex] = useState(0)
    // const [usersListSize, setUsersListSize] = useState(0)
    const [matchedUser, setMatchedUser] = useState(false)
    // const prevIndex = useRef(-1)
    
    // users - useGetAvailableUsers with respect to the user
    const { data: users,
            isLoading: usersLoading,
            isSuccess: usersSuccess,
            isError: usersError,
            error: usersErrorMsg } = useGetAvailableUsersQuery({ userId })

    // Straight away Set UsersList and UsersListSize when usersSuccess is true
    // useEffect(() => {
    //     if (usersSuccess) {
    //         // setUsersList(prevUsers => [...users])
    //         setUsersList([...users])
    //         setUsersListSize(prevSize => users.length)
    //         prevIndex.current = users.length
    //     }
    // }, [usersSuccess]) 
    
    const [likedUser, {
        isLoading: likedUserLoading
    }] = useLikedUserMutation()

    const [skippedUser, {
        isLoading: skippedUserLoading,
    }] = useSkippedUserMutation()

    const [createChat, {
        isLoading: createChatLoading,
    }] = useCreateChatMutation()

    /*
        Input - userId and likedUserId
        Output - response a boolean value (true/false) to determine whether matched between the two occurs
    */
    const onLikedClicked = async (userId, likedUserId) => {
        const response = await likedUser({ userId, likedUserId })
        console.log("response: ", response)
        const { matched } = response.data; // Extract the 'matched' property from the response
        console.log("WHY MATCHED IS : ", matched)
        if (matched) {
            console.log("ITS A MATCHED BRUH!")
            // MatchedUser assigned to true
            setMatchedUser(true)
            // Create a Chat between both of them
            await createChat({ userId, likedUserId })
        }
        else {
            // MatchedUser assigned to false
            setMatchedUser(false)
            // Update the activeUser by increment + 1
            setActiveUserIndex((prevIndex) => prevIndex + 1);
        }
    }

    /*
        Input - userId and likedUserId
        Output - No output because just updating the user's status
    */
    const onSkipClicked = async (userId, skippedUserId) => {
        await skippedUser({ userId, skippedUserId })
        setMatchedUser(false)
        setActiveUserIndex((prevIndex) => prevIndex + 1);
    }

    /*
        Input - No input because just an onClick event 
        Output - No output, is just performing task
    */
    const onSendMessageClicked = () => {
        setMatchedUser(false)
        setActiveUserIndex((prevIndex) => prevIndex + 1)
        // Navigating the user to the messages page
        navigate('/messages')
    }
    /*
        Input - No input because just an onClick event 
        Output - No output, is just performing task
    */
    const onContinueSwipeClicked = () => {
        setMatchedUser(false)
        setActiveUserIndex((prevIndex) => prevIndex + 1);
    }

    // NoMoreSwipeMessage - returns a popup message when no more swipes 
    const NoMoreSwipeMessage = () => {
        return (
          <div id="no-more-swipe-msg">
            {/* If no more users to swipe */}
            <IconContext.Provider value={{ color: "red", className: "ghost-styles"}}>
              <RiGhostSmileLine />
            </IconContext.Provider>
            <h1>That's Everyone!</h1>
            <h5>You've seen all today! Come back tomorrow!</h5>
          </div>
        )
    }

    // Only when it success it will show the page
    if (usersSuccess) {
        const activeUser = users[activeUserIndex]; // Get the first element of the array
        return (
          <section>
            <div id="welcome">
              <div id="welcome-right">
                {users.length > 0 ? 
                (
                    <div key={activeUser._id}>
                        <div id="profile-card">
                            <img src={activeUser.myFile} alt="" />
                            <div id="profile-particular">
                            <h1>{activeUser.name}</h1>
                            <h5>Interest: {activeUser.interest.join(", ")}</h5>
                            <h5>Age: {calculateAge(activeUser.dob)}</h5>
                            </div>
                        </div>
                        <div id="like-msg-btn">
                            <IconContext.Provider value={{ className: "cross-styles" }}>
                                <RxCross2 onClick={() => onSkipClicked(userId, activeUser._id)} />
                            </IconContext.Provider>
            
                            <IconContext.Provider value={{ color: "red", className: "heart-styles" }}>
                                <FcLike onClick={() => onLikedClicked(userId, activeUser._id)} />
                            </IconContext.Provider>
                        </div>
                        {/* Additional code for matched user animation */}
                        {matchedUser && (
                            <div id="match-overlay">
                                <div id="match-overlay-content">
                                    <h2>It's a Match!</h2>
                                    <h3>
                                        You and {activeUser.name} have liked each other!
                                    </h3>
                                    <div id="match-photos">
                                        <div className="match-photo">
                                            <img src={user.myFile} alt="" />
                                            <span>You</span>
                                        </div>
                                        <div className="match-photo">
                                            <img src={activeUser.myFile} alt="" />
                                            <span>{activeUser.name}</span>
                                        </div>
                                    </div>
                                    <div id="msg-swipe-btn">
                                        <button 
                                            onClick={onSendMessageClicked}
                                            id="send-message-btn"
                                        >
                                            Send Message
                                        </button>
                                        <button
                                            onClick={onContinueSwipeClicked}
                                            id="continue-swiping-btn"
                                        >
                                            Continue Swiping
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        </div>
                )
                :
                (
                    // prevIndex.current !== -1 && usersList.length === 0 && <NoMoreSwipeMessage />
                    users.length === 0 && <NoMoreSwipeMessage />
                )}
              </div>
            </div>
          </section>
        )
      }
      else {
        return <LoaderSpinner color="pink" />
      }
}
export default Welcome

function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    
    let age = today.getFullYear() - dob.getFullYear();
    
    // Check if the birthday has already occurred this year
    const hasBirthdayOccurred = today.getMonth() > dob.getMonth() || 
                                (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
    
    // Subtract 1 from age if the birthday has not occurred this year
    if (!hasBirthdayOccurred) {
      age--;
    }
    return age;
}
