const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: { 
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }, 
    name : {
        type: String,
        required: true
    },
    myFile: {
        type: String,
        required: true
    },
    interest: {
        type: [String],
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    numberOfLikes: {
        type: Number,
        default: 0,
    },
    likedWho: {
      type: [
          {
            userYouLiked: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            youLikedAt: { type: Date },
            _id: false, // Optional: To exclude the auto-generated _id field
          }
      ],
      default: []
    }, 
    // likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likedBy: {
      type: [
          {
            likedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            likedAt: { type: Date },
            _id: false, // Optional: To exclude the auto-generated _id field
          }
      ],
      default: []
    }, 
    skippedUsers: {
      type: [
          {
            skippedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            skippedAt: { type: Date },
            _id: false, // Optional: To exclude the auto-generated _id field
          }
      ],
      default: []
    }, 
    matchedUsers: {
      type: [
          {
              matchedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
              matchedAt: { type: Date },
              _id: false, // Optional: To exclude the auto-generated _id field
          }
      ],
      default: []
    }, 
})

// Create indexes for the specified fields
userSchema.index({ 'likedBy.likedUser': 1 });
userSchema.index({ 'skippedUsers.skippedUser': 1 });
userSchema.index({ 'matchedUsers.matchedUser': 1 });

module.exports = mongoose.model('User', userSchema)