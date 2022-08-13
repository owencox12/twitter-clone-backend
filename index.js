import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'
import * as PostControllers from './controllers/postsControllers.js'
import * as UserControllers from './controllers/userControllers.js'
import * as CommentsControllers from './controllers/commentsController.js'
import * as followsControllers from './controllers/followsControllers.js'
import * as tagsControllers from './controllers/tagsControllers.js'
import * as likesControllers from './controllers/likesControllers.js'
import { postsValidation, registerValidation } from './validation.js'
import handleValid from './handleValid.js'
import multer from 'multer'
import checkAuth from './checkAuth.js'
import fs from 'fs'

const app = express()
app.use(express.json())
app.use(cors())

mongoose
	.connect(process.env.MONGODB_URI)
	.then(res => console.log('MONGO DB IS OK'))
	.catch(err => console.log(err))

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads')
		}
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })

app.post('/upload', upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})
app.use('/uploads', express.static('uploads'))

app.post(
	'/posts',
	postsValidation,
	checkAuth,
	handleValid,
	PostControllers.createPost
)

// павпв ап вап ва павпвgg dfg dfg df gdf dfg dfпв апвап вап
//  вапвап ва пва пваg fgd fgdfdfg d пв вап вв пва пп ва пв
//   авпва п вап ваggfd gdf gd  dfgdf вап вап вап вап вап

//posts
app.get('/posts', checkAuth, PostControllers.getAll)
app.get('/posts/:id', checkAuth, PostControllers.getOne)
app.delete('/posts/:id', PostControllers.deletePost)
app.get('/user/posts/:id', checkAuth, PostControllers.getUserPosts)
app.get('/popularity', checkAuth, PostControllers.sortPosts)

//user
app.post('/register', registerValidation, handleValid, UserControllers.register)
app.post('/login', UserControllers.login)
app.get('/me', checkAuth, UserControllers.getMe)
app.get('/user/:id', checkAuth, UserControllers.getUser)
app.patch('/user/:id/update', checkAuth, UserControllers.updateUserInfo)
app.get('/search', UserControllers.search)

//comments

app.post('/comm/:id', checkAuth, CommentsControllers.addComm)
app.get('/comments', CommentsControllers.getComments)
app.delete('/comm/:id', checkAuth, CommentsControllers.delComm)
app.get('/user/comments/:id', checkAuth, CommentsControllers.getUserComments)

//tags

app.post('/tags/:id', checkAuth, tagsControllers.setTags)
app.get('/tags', checkAuth, tagsControllers.getLastTags)

app.get('/recomendation', checkAuth, UserControllers.getRecomendation)

// likes

app.get('/likes/:id', checkAuth, likesControllers.giveLike)
app.delete('/likes/:id', checkAuth, likesControllers.delLike)
app.get('/user/likes/:id', checkAuth, likesControllers.getLikesPosts)

// follow

app.get('/follow/:id/', checkAuth, followsControllers.follow)
app.delete('/follow/:id/delete', checkAuth, followsControllers.unFollow)
app.get('/follow/:id/new', checkAuth, followsControllers.getFollowPosts)

app.listen(process.env.PORT || 4444, err => {
	if (err) {
		console.log(err)
	}
	console.log('Server OK')
})
