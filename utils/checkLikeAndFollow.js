import LikesModel from '../models/like.js'
import FollowsModel from '../models/follows.js'

export const checkLike = async (posts, user) => {
	const likeByUser = await LikesModel.find({ userLike: user })
	const b = []
	likeByUser.forEach(v => b.push(String(v.userPosts)))
	for (let i = 0; i < posts.length; i++) {
		if (b.includes(String(posts[i]._id))) {
			posts[i].likeBoolean = true
		} else {
			posts[i].likeBoolean = false
		}
	}
	const follows = await FollowsModel.find({ userFollowed: user })
	const t = []
	follows.forEach(v => t.push(String(v.userPosts)))
	for (let i = 0; i < posts.length; i++) {
		if (t.includes(String(posts[i].user._id))) {
			posts[i].user.followStatus = true
		} else {
			posts[i].user.followStatus = false
		}
	}
	return posts
}
