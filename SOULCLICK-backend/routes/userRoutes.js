const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')

// Route for creating a new user without authentication
// The reason why getAllUsers dont need authentication is because, we dont need to login first
router.route('/')
    .post(usersController.createNewUser)
    .get(usersController.getAllUsers)

// Route for creating a new user without authentication
// Add in to all the route of the Users that uses JWT token
router.use(verifyJWT)

router.route('/')
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

router.route('/like')
    .post(usersController.updateUserLikes)

router.route('/skip')
    .patch(usersController.updateSkipUser)

router.route('/availableUsers')
    .post(usersController.getAvailableUsers)

module.exports = router