import mongoose from 'mongoose'

const { Schema, model } = mongoose

const LikeSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  createdAt: { type: Date, default: Date.now }
})

// Compound index userId adn postId
LikeSchema.index({ userId: 1, postId: 1 }, { unique: true })

const LikeModel = model('Like', LikeSchema)

export default LikeModel
