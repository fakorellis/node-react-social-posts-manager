import mongoose from 'mongoose'

const { Schema, model, Types } = mongoose

const PostSchema = new Schema({
  title: { type: String, required: true, trim: true },
  body: { type: String, required: true, trim: true },
  userId: { type: Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Number, default: () => Date.now() },
  updatedAt: { type: Number, default: () => Date.now() }
})

// Middleware: Auto-update `updatedAt` before every update
PostSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() })
  next()
})

const PostModel = model('Post', PostSchema)

export default PostModel
