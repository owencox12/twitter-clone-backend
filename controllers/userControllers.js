import UserModel from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import followModel from '../models/follows.js'

export const register = async (req, res) => {
	try {
		const isAlreadyReg = await UserModel.findOne({
			email: req.body.email,
			userName: req.body.userName,
		})
		if (isAlreadyReg) {
			return res.status(404).json({
				message: 'Такой email уже зарегистрирован',
			})
		}

		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)
		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			passwordHash: hash,
			avatarUrl: req.body.avatarUrl,
			userName: req.body.userName,
			years: req.body.years,
			dateOfBirth: req.body.dateOfBirth,
		})
		const user = await doc.save()

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d',
			}
		)
		const { passwordHash, ...userData } = user._doc
		res.json({
			...userData,
			token,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Ошибка при регистрации',
		})
	}
}

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ userName: req.body.userName })
		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			})
		}
		const isValid = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		)
		if (!isValid) {
			return res.status(403).json({
				message: 'Не верный логин или пароль',
			})
		}
		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d',
			}
		)

		const { passwordHash, ...userData } = user._doc
		res.json({
			...userData,
			token,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Серверная ошибка при регистрации',
		})
	}
}

export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId)
		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			})
		}
		const { passwordHash, ...userData } = user._doc
		res.json(userData)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Ошибка при поиске пользователя',
		})
	}
}

export const getUser = async (req, res) => {
	try {
		const id = req.params.id
		const user = await UserModel.findById(id)
		const sub = await followModel.find({ userPosts: id })
		const t = []
		sub.forEach(e => t.push(e.userFollowed))
		const s = []
		for (let i = 0; i < t.length; i++) {
			if (String(t[i]) === req.userId) {
				s.push(t[i])
			}
		}
		if (s.length !== 0) {
			user.followStatus = true
		} else {
			user.followStatus = false
		}

		res.json(user)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Ошибка при получении пользователя',
		})
	}
}

export const updateUserInfo = async (req, res) => {
	try {
		const id = req.params.id
		await UserModel.updateOne(
			{
				_id: id,
			},
			{
				fullName: req.body.fullName,
				avatarUrl: req.body.avatarUrl,
				hatImage: req.body.hatImage,
				about: req.body.about,
				location: req.body.location,
				webSite: req.body.webSite,
			}
		)
		res.json({
			success: true,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Ошибка при обновлении профиля',
		})
	}
}

export const search = async (req, res) => {
	try {
		const result = await UserModel.find({
			$text: { $search: req.query.name },
		})
		res.send(result)
	} catch (err) {
		console.log(err)
	}
}

export const getRecomendation = async (req, res) => {
	try {
		const follow = await followModel.find({ userFollowed: req.userId })
		const ids = []
		for (let i = 0; i < follow.length; i++) {
			ids.push(follow[i].userPosts)
		}
		const users = await UserModel.find({
			$and: [{ _id: { $nin: ids } }, { _id: { $ne: req.userId } }],
		}).limit(3)
		res.json(users)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Ошибка при получении пользователей',
		})
	}
}
