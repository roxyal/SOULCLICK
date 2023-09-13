import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate, useLocation } from 'react-router-dom'
import { FiHelpCircle } from 'react-icons/fi'
import { useParams } from "react-router-dom"

const Footer = () => {

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const onGoHomeClicked = () => navigate('/soulclick')

    let goHomeButton = null
    // if (pathname !== '/soulclick') {
    //     goHomeButton = (
    //         <button
    //             className="home-footer-button"
    //             title="Home"
    //             onClick={onGoHomeClicked}
    //         >
    //             <FiHelpCircle />
    //         </button>
    //     )
    // }

    const content = (
        <footer className="copyright-footer">
            {goHomeButton}
            {/* <p>Current User:</p>
            <p>Status:</p> */}
        </footer>
    )
    return content
}
export default Footer