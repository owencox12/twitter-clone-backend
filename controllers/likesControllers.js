import LikesModel from '../models/like.js'
import PostsModel from '../models/posts.js'
import { checkLike } from '../utils/checkLikeAndFollow.js'

export const giveLike = async (req, res) => {
	try {
		const doc = new LikesModel({
			userLike: req.userId,
			userPosts: req.params.id,
		})
		await doc.save()
		const post = await PostsModel.findById(req.params.id)
		post.likeCount = post.likeCount + 1
		await post.save()
		res.send({
			success: true,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось лайкнуть запись',
		})
	}
}

export const delLike = async (req, res) => {
	try {
		const id = req.params.id
		const post = await LikesModel.find({ userLike: req.userId })
		let t = {}
		for (let i = 0; i < post.length; i++) {
			if (String(post[i].userPosts) === id) {
				t = post[i]
			}
		}
		LikesModel.findOneAndDelete(
			{
				_id: t._id,
			},
			async (err, doc) => {
				if (err) {
					return res.status(404).json({
						message: 'Ошибка при удаление лайка',
					})
				}
				if (!doc) {
					return res.status(403).json({
						message: 'Лайк не найден',
					})
				}
				const post = await PostsModel.findById(id)
				post.likeCount = post.likeCount - 1
				await post.save()
				res.json({
					success: true,
				})
			}
		)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Ошибка при удаление лайка',
		})
	}
}

export const getLikesPosts = async (req, res) => {
	try {
		const likes = await LikesModel.find({ userLike: req.params.id })
		const t = []
		likes.forEach(v => t.push(v.userPosts))
		const posts = await PostsModel.find({ _id: { $in: t } }).populate('user')
		const result = await checkLike(posts, req.userId)
		res.json(result.reverse())
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить лайкнутые посты',
		})
	}
}
