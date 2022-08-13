import PostsModel from '../models/posts.js'
import CommentsModel from '../models/comments.js'

export const addComm = async (req, res) => {
	try {
		const id = req.params.id
		const doc = new CommentsModel({
			text: req.body.text,
			user: req.userId,
			post: id,
			imageUrl: req.body.imageUrl,
		})
		const comm = await doc.save()
		comm.populate({
			path: 'user',
			model: 'User',
		})
		const relatedPost = await PostsModel.findById(id)
		relatedPost.comments.push(comm)
		await relatedPost.save()
		res.json(
			relatedPost.comments.splice(
				relatedPost.comments.length - 1,
				relatedPost.comments.length
			)
		)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Ошибка при отправке комментария',
		})
	}
}

export const getComments = async (req, res) => {
	try {
		const id = req.query.id
		const comms = await CommentsModel.find({ post: id })
			.populate({
				path: 'user',
				model: 'User',
			})
			.exec()
		res.json(comms)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Ошибка при поиске комментариев',
		})
	}
}

export const delComm = async (req, res) => {
	try {
		const id = req.params.id
		CommentsModel.findOneAndDelete(
			{
				_id: id,
			},
			(err, doc) => {
				if (err) {
					return res.status(404).json({
						message: 'Ошибка при удалении комментария',
					})
				}
				if (!doc) {
					return res.status(403).json({
						message: 'Комментарий не найден',
					})
				}
				res.json({
					success: true,
				})
			}
		)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Ошибка при удалении комментария',
		})
	}
}

export const getUserComments = async (req, res) => {
	try {
		const commentsUser = await CommentsModel.find({
			user: req.params.id,
		}).populate({
			path: 'user',
			model: 'User',
		})
		res.json(commentsUser)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось найти комментарии пользователя',
		})
	}
}
