import { Link } from "react-scroll";
import { FiMenu } from "react-icons/fi";
import { useRef, useState, useEffect, useMemo } from 'react';
import Login from '../features/auth/Login';
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";
import { useNavigate } from 'react-router-dom'
import { useGetUsersQuery } from "../features/users/usersApiSlice";
import { io } from 'socket.io-client'
/*
    Reusable NavBar that takes NAV_ITEMS as an input
*/
const NavBar = ({ NAV_ITEMS, navOtherPage }) => {

    const navigate = useNavigate()

    const socket = useRef()
    
    const onProfileClicked = () => navigate('/profile')

    // If user is login, we will be able to obtain a userId
    const { userId } = useAuth()

    // Obtain the user's particular
    // User - Is an object that contain fields like name, dob etc
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        }),
    })

    // Use useMemo to memoize the user object
    const memoizedUser = useMemo(() => user, [user]);

    // Destructuted the sendLogoutMutation
    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    // If successfully trigger sendLogout, it will navigate back to the homepage which '/'  
    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess, navigate])

    // Set up the connection such that we can communicate with the socket.io (in the backend)
    useEffect(() => {
        socket.current = io('http://localhost:8800')
    }, [])

    const onLogoutClicked = () => {
        sendLogout()
        // Whenever user logout, we disconnect their socket...
        socket.current.emit('disconnect-user', userId);
    }

    // When User login, the NavBar will change from Login Button to Logout button
    const Logout = (
        <button className="nav-icon-btn"
            onClick={onLogoutClicked}
            title="Logout"
        >
            Logout
        </button>
    )

    // Handle the state transition when the user click the search button
    const [searchActive, setSearchActive] = useState(false)
    // Handle the state transition when the user click the close button
    const [closeActive, setCloseActive] = useState(false)

    const onHandleSearchClicked = () => {
        setSearchActive(true)
        setCloseActive(true)
    }

    const oneHandleCloseClicked = () => {
        setSearchActive(false)
        setCloseActive(false)
    }

    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <>
            <header className="nav-header">
                <nav className={`${menuOpen ? 'open' : ''}`}>
                    {navOtherPage ? 
                    <button 
                        className="logo-btn"
                        onClick={() => navigate('/discover')}
                    >   
                        SOULCLICK
                    </button>
                    :
                    <Link
                        className="logo-btn"
                        to="hero"
                        spy={true}
                        // activeClass={true}
                        offset={-100}
                        duration={500}
                    >
                        SOULCLICK
                    </Link>
                    }
                    <div className="nav-group">
                        { user !== undefined ?
                        (
                            <div>
                                <img onClick={onProfileClicked} className="profile-btn" src={memoizedUser?.myFile} alt="" />
                            </div>
                        )
                        :
                        ''
                        }
                        <ul className="navigation">
                            {NAV_ITEMS.map((item, idx) => {
                                return (
                                    <li key={idx}>
                                        {navOtherPage ?
                                        <button 
                                            className="nav-icon-btn"
                                            onClick={() => navigate(`/${item.page}`)}
                                        >
                                            {item.label}
                                        </button>
                                        :
                                        <Link
                                            className="nav-icon-btn"
                                            to={item.page}
                                            spy={true}
                                            // activeClass={true}
                                            offset={-100}
                                            duration={500}
                                        >
                                        {item.label}
                                        </Link>
                                        }
                                    </li>
                                )
                            })}
                        </ul>
                        {/* <div className="nav-search">
                            <button className={`searchBtn ${closeActive ? 'active' : ''}`}
                                onClick={onHandleSearchClicked}>
                                <FiSearch />
                            </button>
                            <button className={`closeBtn ${closeActive ? 'active' : ''}`} 
                                onClick={oneHandleCloseClicked}>
                                <FiX />
                            </button>
                        </div> */}
                        <div className="logout-translate-right">
                            {userId !== '' ? Logout : <Login />}
                        </div>
                        <button className={`menuToggle ${searchActive ? 'hide' : ''}`} 
                            onClick={()=>setMenuOpen(!menuOpen)}>
                            <FiMenu />
                        </button>
                    </div>
                    {/* <div className={`nav-searchbox ${searchActive ? 'active' : ''}`}>
                        <input type="text" placeholder="Search here . . ." />
                    </div> */}
                </nav>
            </header>
        </>
    )
}
export default NavBar