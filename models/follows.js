import mongoose from "mongoose";



const FollowsSchema = new mongoose.Schema({
    userPosts: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userFollowed: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

export default mongoose.model('Follows', FollowsSchema)