import { Outlet, useParams } from 'react-router-dom'
import Footer from './Footer'
import NavBar from './Navbar'
import HOME_NAV_ITEMS from './NavBar_data.js/home_nav'

const HomeLayout = () => {
    return (
        <main>
            <NavBar NAV_ITEMS={HOME_NAV_ITEMS} navOtherPage={true}/>
                <div>
                    <Outlet />
                </div>
            <Footer />
        </main>
    )
}
export default HomeLayout