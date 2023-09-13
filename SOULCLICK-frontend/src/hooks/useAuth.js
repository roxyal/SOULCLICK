import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../features/auth/authSlice'
import jwtDecode from 'jwt-decode'

/*
    useAuth - Obtains the current User which is accessing through the use of current token
*/
const useAuth = () => {
    const token = useSelector(selectCurrentToken) // get the current token of the user

    if (token) {
        const decoded = jwtDecode(token) // decode the token of the user, to see what is his email/userId        
        
        const { email, userId } = decoded.UserInfo
        return { email, userId }
    }

    return { email: '', userId: ''}
}
export default useAuth