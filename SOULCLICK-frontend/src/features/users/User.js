import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { selectUserById } from "./usersApiSlice"; (We dont need to use this anymore)
import { useGetUsersQuery } from "./usersApiSlice";
import { memo } from 'react'

// User represents the Profile of a user
// name, email, password, interest (arrayOfString), gender, dob (string), postImage.myFile (to get the file)
// We will not be showing email and password because we dont want to show it to the other people (privacy usage)

// With *memo*, Now this component will only re-render only if there is any changes made
const User = ({ userId }) => {
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        }),
    })

    const navigate = useNavigate()
    
    if (user) {
        const handleEdit = () => navigate(`/soulclick/users/${userId}`)

        const userInterestStr = user.interest.toString()

        return (
            <div>
                `Welcome ${userId}`
            </div>
        )
    } else return null
}
const memoizedUser = memo(User)
export default memoizedUser