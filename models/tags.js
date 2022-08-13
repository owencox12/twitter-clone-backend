import mongoose from "mongoose"



const TagsSchema = new mongoose.Schema({
    tags: {
        type: Array,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model('Tags', TagsSchema)