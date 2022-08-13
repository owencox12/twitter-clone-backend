import mongoose from 'mongoose'

const PostsSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		imageUrl: {
			type: String,
		},
		viewsCount: {
			type: Number,
			default: 0,
		},
		comments: [
			{
				type: mongoose.Schema.Types.Object,
				ref: 'comments',
			},
		],
		tags: [
			{
				type: mongoose.Schema.Types.Object,
				ref: 'tags',
			},
		],
		likeCount: {
			type: Number,
			default: 0,
		},
		likeBoolean: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
)

export default mongoose.model('Posts', PostsSchema)
