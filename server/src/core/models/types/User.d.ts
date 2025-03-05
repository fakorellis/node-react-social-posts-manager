type User = {
  _id?: Mongoose.ObjectId | string
  email: string
  password: string
  firstName: string
  lastName: string
  fullName: string
  username: string
}

type UserLoginRequest = {
  username: string
  password: string
}

type UserResource = {
  _id?: Mongoose.ObjectId | string
  email: string
  firstName: string
  lastName: string
  fullName: string
  username: string
}