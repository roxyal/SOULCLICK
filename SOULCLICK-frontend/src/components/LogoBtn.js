import React from 'react'
import { useNavigate } from 'react-router-dom'

// Reusuable LogoBtn
const LogoBtn = () => {
    
    const navigate = useNavigate()
    return (
        <div className="logo-container">
            <button onClick={() => navigate('/')}className="logo-btn">SOULCLICK</button>
        </div>
    )
}
export default LogoBtn
