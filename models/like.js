import mongoose from "mongoose";


const LikeSchema = new mongoose.Schema({
	userLike: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	userPosts: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
}, {
	timestamps: true
})

export default mongoose.model("Likes", LikeSchema)