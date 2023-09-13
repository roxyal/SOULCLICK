import React from 'react'
import flying_castle from '../features/img/illustration/flying_castle.png'
import Login from '../features/auth/Login'
import { useState } from 'react'
import LogoBtn from '../components/LogoBtn'
import useTitle from '../hooks/useTitle'

const SuccessCreationPage = () => {

    useTitle('SOULCLICK: Account Create Success (LOGIN NOW)')
    // Handle the showLoginForm when the image animation is done
    const [showLoginForm, setShowLoginForm] = useState(false);

    const handleAnimationEnd = () => {
        setShowLoginForm(true);
    };

    return (
        <>
            <LogoBtn />
            <div id="login">
                <div id="success-creation">
                    <p className={showLoginForm ? 'active': ''}>You have successfully created<br />your account!</p>
                    {showLoginForm && <Login />}
                </div>
                <img src = {flying_castle} alt="" onAnimationEnd={handleAnimationEnd}/>
            </div>
        </>
    )
}
export default SuccessCreationPage