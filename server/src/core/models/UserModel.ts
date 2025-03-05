import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const { Schema, model } = mongoose

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  fullName: { type: String, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  createdAt: { type: Number, default: () => Date.now() },
  updatedAt: { type: Number, default: () => Date.now() }
})

// Middleware: Auto-generate `fullName`and hash password before saving
UserSchema.pre('save', function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`

  // Hash password if it has been modified (or is new)
  if (!this.isModified('password')) return next()

  bcrypt
    .hash(this.password, 10)
    .then((hashedPassword) => {
      this.password = hashedPassword
      next()
    })
    .catch((error) => next(error))
})

// Middleware: Update `updatedAt` field before every update
UserSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() })
  next()
})

const UserModel = model('User', UserSchema)

export default UserModel
