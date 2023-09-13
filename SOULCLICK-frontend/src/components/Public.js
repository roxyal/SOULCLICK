import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import NavBar from './Navbar'
import Testimonial from './Testimonial/Testimonial'
import Contact from './Contact'
import Hero from './Hero'
import About from './About'
import PUBLIC_NAV_ITEMS from './NavBar_data.js/public_nav'
import '../index.css'
import useAuth from '../hooks/useAuth'

const Public = () => {
   
    const navigate = useNavigate()
    const { userId } = useAuth()

    console.log("userId: ", userId)

    useEffect(() => {
        // If userId is not empty, navigate to the /discover route
        if (userId !== "") {
            navigate("/discover");
        }
      }, [userId, navigate]);

    // If the email returned is an empty string, then it means the user has not login
    // Thus, he cannot be able to go other website

    if (userId === "") {
        return (
            <>
                <NavBar NAV_ITEMS={PUBLIC_NAV_ITEMS} navOtherPage={false}/>
                <main className="main-container">
                    <Hero />
                    <About />
                    <Testimonial />
                    <Contact />
                    {/* <footer>
                        <Link to="/login">Login</Link>
                    </footer> */}
                </main>
            </>
        )
    }
    
}
export default Public