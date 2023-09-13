import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

/*
    Check to see if User is Authenticated (Login)
*/
const RequireAuth = () => {
    const location = useLocation() // get the current path (which the user is on)
    const { email } = useAuth()

    // If the email returned is an empty string, then it means the user has not login
    // Thus, he cannot be able to go other website
    const content = (
        email ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />
    ) 

    return content
}
export default RequireAuth