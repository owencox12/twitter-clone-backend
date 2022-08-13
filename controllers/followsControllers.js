import FollowsModel from '../models/follows.js'
import PostsModel from '../models/posts.js'
import UserModel from '../models/user.js'
export const follow = async (req, res) => {
	try {
		const doc = new FollowsModel({
			userPosts: req.params.id,
			userFollowed: req.userId,
		})
		await doc.save()
		const user = await UserModel.findById(req.userId)
		const userSub = await UserModel.findById(req.params.id)
		user.followCounter = user.followCounter + 1
		userSub.subscribeCounter = userSub.subscribeCounter + 1
		await user.save()
		await userSub.save()
		res.json({
			success: true,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Ошибка при подписке',
		})
	}
}

export const unFollow = async (req, res) => {
	try {
		const id = req.params.id
		const sub = await FollowsModel.find({ userFollowed: req.userId })
		let t = {}
		for (let i = 0; i < sub.length; i++) {
			if (String(sub[i].userPosts) === id) {
				t = sub[i]
			}
		}
		FollowsModel.findOneAndDelete(
			{
				_id: t._id,
			},
			async (err, doc) => {
				if (err) {
					return res.status(404).json({
						message: 'Не удалось отписаться',
					})
				}
				if (!doc) {
					return res.status(500).json({
						message: 'Юзер не найден',
					})
				}
				const userMinusSub = await UserModel.findById(req.params.id)
				const userMinusFollow = await UserModel.findById(req.userId)
				userMinusSub.subscribeCounter = userMinusSub.subscribeCounter - 1
				userMinusFollow.followCounter = userMinusFollow.followCounter - 1
				await userMinusFollow.save()
				await userMinusSub.save()
				res.json({
					success: true,
				})
			}
		)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось отписаться',
		})
	}
}

export const getFollowPosts = async (req, res) => {
	try {
		const id = req.params.id
		const posts = await PostsModel.find({ user: id }).populate('user')
		res.json(posts)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Ошибка при получее новый постов',
		})
	}
}
