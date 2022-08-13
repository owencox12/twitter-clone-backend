import mongoose from 'mongoose'

const CommentsSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
		},
		Date: {
			type: Date,
			default: Date.now,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: true,
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
		},
		imageUrl: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
)

export default mongoose.model('Comments', CommentsSchema)
