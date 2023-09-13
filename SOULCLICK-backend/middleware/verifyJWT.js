const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    // The verifyJWT function first checks if the Authorization header exists and starts with the string "Bearer".
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    
    // Split the token using whitespace,
    // first element is Bearer, second element is the token
    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden'})
            req.email = decoded.UserInfo.email
            req.userId = decoded.UserInfo._id
            next() // next() function is called to move on to the next middleware function.
        }
    )
}
module.exports = verifyJWT  