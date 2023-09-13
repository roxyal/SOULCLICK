const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// @desc Login
// @route POST /auth
// @access Public

// Once a user is authenticated, the system will trigger a access and refresh token for the user

// Access Token: Sent as JSON (client stores in memory) DO NOT store in local storage or cookie
// Store in application state, will be lost when the browser is close
const login = async (req, res) => {
    const { email, password } = req.body

    if (!email && !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    if (!email) {
        return res.status(400).json({ message: 'Email field is required' })
    }

    if (!password) {
        return res.status(400).json({ message: 'Password fields is required' })
    }

    // Check from MongoDB to see if its a valid email
    const foundUser = await User.findOne({ email }).exec()

    if (!foundUser) {
        return res.status(401).json({ message: 'The email account does not exist' })
    }

    // Compare the user's key in password and the password that is tied to the User's database
    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) {
        return res.status(402).json({ message: 'Password incorrect! Please try again' })
    }

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "email": foundUser.email,
                "userId": foundUser._id,
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { "email": foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    )

    // Create secure cookie with refresh token
    // Naming it jwt, passing in the refreshToken
    res.cookie('jwt', refreshToken, {
        httpOnly: true, // accessible only by web server (not javascript)
        secure: true, // https
        sameSit: 'None', //cross-site coookie
        maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expiry: set to match with refresh Token (7days)
    })
    
    // Send accessToken containing email and interest
    res.json({ accessToken })
}
// Refresh Token: Sent as httpsOnly Cookie (NOT accessible via javascript prevent HACKERS)
// Will have an expiry at some point
const refresh = async (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    // Verify the token
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ email: decoded.email }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": foundUser.email,
                        "userId": foundUser._id,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )
            res.json({ accessToken })
        })
}

const logout = async (req, res) => {
    const cookies = req.cookies

    // Check the cookie whether if its .jwt
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout
}