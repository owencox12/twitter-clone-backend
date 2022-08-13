import TagsModel from '../models/tags.js'
import PostsModel from '../models/posts.js'


export const setTags = async (req, res) => {
    try {
        const tag = req.body.tags.split(' ')
        const id = req.params.id
        const doc = new TagsModel({
            tags: tag,
            post: id,
        })
        await doc.save()
        const post = await PostsModel.findById(id)
        for (let i = 0; i < tag.length; i++) {
            if (tag[i] !== '') {
                post.tags.push(tag[i])
            }
        }
        post.populate('user')
        await post.save()
        res.json(post)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось добавить тэги'
        })
    }
}

export const getLastTags = async (req, res) => {
    try {
        const tags = await TagsModel.find().sort({ $natural: -1 }).limit(7)
        res.json(tags)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось найти тэги'
        })
    }
}