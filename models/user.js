import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		avatarUrl: {
			type: String,
			default: '/uploads/notfoundUser.jpg',
		},
		dateOfBirth: {
			type: Number,
		},
		years: {
			type: String,
		},
		userName: {
			type: String,
			required: true,
		},
		hatImage: {
			type: String,
		},
		about: {
			type: String,
		},
		location: {
			type: String,
		},
		webSite: {
			type: String,
		},
		followStatus: {
			type: Boolean,
			default: false,
		},
		followCounter: {
			type: Number,
			default: 0,
		},
		subscribeCounter: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
)
UserSchema.index({ fullName: 'text' })

export default mongoose.model('User', UserSchema)
