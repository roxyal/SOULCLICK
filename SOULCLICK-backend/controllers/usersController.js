const User = require('../models/user')
const Chat = require('../models/chat')
const Message = require('../models/message')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

// @desc Get all users
// @route GET /users
// @access Private

const getAllUsers = async (req, res) => {
    // Get all users from MongoDB
    // but not selecting password/email (privacy usage)
    const users = await User.find().select('-password').lean()

    // if there are no users
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found'})
    }
    res.json(users)
}

// @desc Create new users
// @route POST /user
// @access Private

const createNewUser = async (req, res) => {
    // req.body is the parameters that is either send from POSTMAN or from the Website (e.target.value)
    const { name, email, password, interest, gender, dob, postImage } = req.body

    if (!name) return res.status(400).json({ message: 'Name field is empty'})
    if (!email) return res.status(400).json({ message: 'Email field is empty'})
    if (!password) return res.status(400).json({ message: 'Password field is empty'})
    if (!interest) return res.status(400).json({ message: 'Interest field is empty'})
    if (!gender) return res.status(400).json({ message: 'Gender field is empty'})
    if (!dob) return res.status(400).json({ message: 'Date of Birth is empty'})
    if (!postImage.myFile) return res.status(400).json({ message: 'Profile Image is empty'})

    // Check for duplicate username
    // Collation - is just try to check if its english word
    const duplicate = await User.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec()
    if (duplicate){
        return res.status(400).json({ message: `The email: ${email} already exist, please try another`})
    }
 
    // Hash password (for security purposes)
    const hashedPwd = await bcrypt.hash(password, 10) // 10 salt rounds

    const userObject = { name, email, "password": hashedPwd, interest, gender, dob, "myFile": postImage.myFile}

    // Create and the store the new user into our database
    const user = await User.create(userObject)

    if (user) { // User created successfully
        res.status(201).json({ message: `Account: ${email} created successfully`})
    }
    else {
        res.status(400).json({ message: `Invalid Account creation data`})
    }
}

// @desc Update a user
// @route PATCH /users
// @access Private

const updateUser = async (req, res) => {
    const { id, name, email, password, interest, postImage } = req.body

    // Check if there is any field being entered
    if (!name && !email && !password && !interest && !myFile) {
        return res.status(400).json({ message: 'No fields has been entered'})
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Update the user with new variables
    if (name) user.name = name
    if (email) user.email = email
    if (interest) user.interest = interest
    if (postImage.myFile) user.myFile = postImage.myFile

    if (password) {
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()
    res.json({ message: `Your profile has been updated successfully` })
}
// @desc Delete the user
// @route PATCH /users
// @access Private

const deleteUser = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'No such UserID' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'No such user'})
    }

    // Find all chats associated with the user
    const chats = await Chat.find({ members: { $in: [id] } })

    // Iterate through each chat and remove associated messages
    for (const chat of chats) {
        await Message.deleteMany({ chatId: chat._id })
    }

    // Remove all chats associated with the user
    await Chat.deleteMany({ members: { $in: [id] } })

    const result = await user.deleteOne()

    const reply = `Your account ${result.email} has been deleted successfully`

    res.json(reply)
}

// @desc Update the user LIKE field and who LIKE them
// @route PATCH /users
// @access Private

const updateUserLikes = async (req, res) => {

  // Check if both of them liked each other or not
  let matched = false;

  const { userId, likedUserId } = req.body

  // the user at here is likedUserId (the user that you LIKE)
  // const user = await User.findById(likedUserId)

  // // The likedUser at here refers to the the user that like the person 
  // const likedUser = await User.findById(userId)

  const [user, likedUser] = await Promise.all([
      User.findById(likedUserId),
      User.findById(userId)
  ]);

  if (!user) {
      return res.status(404).json({ message: 'The User you liked was not found'})
  }

  const userIdObj = new mongoose.Types.ObjectId(userId);

  // If the user likedBy does not have the person that like him/her, then we push it to the array
  const isAlreadyLiked = user.likedBy.find(obj => obj.likedUser.equals(userIdObj))
  
  if(!isAlreadyLiked) {
      user.likedBy.push({ likedUser: userId, likedAt: new Date() });
      user.numberOfLikes = user.likedBy.length
  }

  // Push the user you liked into the likedWho field
  likedUser.likedWho.push({ userYouLiked: likedUserId, youLikedAt: new Date() })

  const likedUserIdObj = new mongoose.Types.ObjectId(likedUserId);

  if (likedUser.likedBy.find(item => item.likedUser.equals(likedUserIdObj))) {
    // If they are matched, we will push Id to their each other's matched status
    matched = true;
    user.matchedUsers.push({ matchedUser: userId, matchedAt: new Date() })
    likedUser.matchedUsers.push({ matchedUser: likedUserId, matchedAt: new Date() })
  }

  // Save the update the user you like's profile and your own profile
  // await user.save()
  // await likedUser.save()

  // Save changes to both users
  await Promise.all([user.save(), likedUser.save()]);

  console.log("Matched: ", matched)
  res.json({ matched })
}

// @desc Skip the user (you dont like)
// @route PATCH /users
// @access Private

const updateSkipUser = async (req, res) => {
    const { userId, skippedUserId } = req.body

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the skipped user to the skippedUsers array with the current timestamp
    user.skippedUsers.push({ skippedUser: skippedUserId, skippedAt: new Date() });

    // Save the update user
    const updatedUser = await user.save()
    res.json({ message: `Skipped successfully, profile updated` })
}

// @desc Get Avaliable User (with respect to the login User)
// @route GET /users
// @access Private
const getAvailableUsers = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Get all the skipped user IDs from the skippedUsers array
  const likedWhoIds = user.likedWho.map(
    (likedWhoId) => likedWhoId.userYouLiked
  );

  // Get all the skipped user IDs from the skippedUsers array
  const skippedUserIds = user.skippedUsers.map(
    (skippedUser) => skippedUser.skippedUser
  );

  let pipeline = [
    // We do the match first to filter
    {
      $match: {
        gender: { $ne: user.gender }, // Only consider opposite gender
        _id: { $nin: likedWhoIds }, // Exclude users you already LIKE
      },
    },

    // After that, we create an addFields to check for the number of similar interest with respect
    // to other people's interest
    {
      $addFields: {
        interestScore: {
          $size: { $setIntersection: ['$interest', user.interest] }, // Calculate the number of shared interests
        },
      },
    },

    // Sort the list in descending order according to interestScore
    {
      $sort: { interestScore: -1 }, // Sort by interestScore in descending order
    },

    {
      $match: {
        _id: { $nin: skippedUserIds }, // Exclude skipped users
        skippedUsers: {
          $not: {
            $elemMatch: {
              skippedAt: {
                $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Exclude skipped users within the cooldown period (7 days)
              },
            },
          },
        },
      },
    },

    // 0 - represents the fields we don't want to return
    {
      $project: { password: 0, email: 0, gender: 0, numberOfLikes: 0 },
    },
  ];

  // Find available users based on the pipeline
  const availableUsers = await User.aggregate(pipeline)

  return res.json(availableUsers)
}
module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    updateUserLikes,
    updateSkipUser,
    getAvailableUsers
}