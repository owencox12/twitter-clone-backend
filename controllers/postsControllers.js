import PostsModel from '../models/posts.js'
import FollowsModel from '../models/follows.js'
import LikesModel from '../models/like.js'
import { checkLike } from '../utils/checkLikeAndFollow.js'
import { follow } from './followsControllers.js'

export const createPost = async (req, res) => {
	try {
		const doc = new PostsModel({
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			user: req.userId,
		})
		await doc.populate('user')
		const post = await doc.save()
		res.json(post)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Ошибка при создании поста',
		})
	}
}

export const deletePost = async (req, res) => {
	try {
		const id = req.params.id
		PostsModel.findOneAndDelete(
			{
				_id: id,
			},
			(err, doc) => {
				if (err) {
					return res.status(404).json({
						message: 'Ошибка при удаление поста',
					})
				}
				if (!doc) {
					return res.status(403).json({
						message: 'Пост не найден',
					})
				}
				res.json({
					success: true,
				})
			}
		)
	} catch (err) {
		res.status(500).json({
			message: 'Ошибка при удаление поста',
		})
	}
}

export const getAll = async (req, res) => {
	try {
		const subs = await FollowsModel.find({ userFollowed: req.userId }).exec()
		const userPosts = []
		subs.forEach(e => {
			userPosts.push(e.userPosts)
		})
		userPosts.push(req.userId)
		const posts = await PostsModel.find({ user: { $in: userPosts } })
			.populate('user')
			.exec()
		const result = await checkLike(posts, req.userId)
		res.json(result)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Ошибка при получении постов',
		})
	}
}

export const getOne = async (req, res) => {
	try {
		const id = req.params.id
		PostsModel.findOneAndUpdate(
			{
				_id: id,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				returnDocument: 'after',
			},
			async (err, doc) => {
				if (err) {
					return res.status(404).json({
						message: 'Ошибка при получении поста',
					})
				}
				if (!doc) {
					return res.status(403).json({
						message: 'Пост не найден',
					})
				}
				const likes = await LikesModel.find({ userLike: req.userId })
				let t = []
				likes.forEach(like => t.push(String(like.userPosts)))
				if (t.includes(String(doc._id))) {
					doc.likeBoolean = true
				} else {
					doc.likeBoolean = false
				}
				res.json(doc)
			}
		)
			.populate('user')
			.populate({
				path: 'comments.user',
				model: 'User',
			})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Ошибка при получение поста',
		})
	}
}

export const getUserPosts = async (req, res) => {
	try {
		const id = req.params.id
		const posts = await PostsModel.find({ user: id }).populate('user')
		const likes = await LikesModel.find({ userLike: req.userId })
		let t = []
		likes.forEach(v => t.push(v.userPosts.toString()))
		for (let i = 0; i < posts.length; i++) {
			if (t.includes(String(posts[i]._id))) {
				posts[i].likeBoolean = true
			}
		}
		res.json(posts.reverse())
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Ошибка при получении постов',
		})
	}
}

export const sortPosts = async (req, res) => {
	try {
		const posts = await PostsModel.find({ tags: { $ne: [] } })
			.sort({ viewsCount: -1 })
			.limit(7)
		res.json(posts)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить популярные посты',
		})
	}
}
