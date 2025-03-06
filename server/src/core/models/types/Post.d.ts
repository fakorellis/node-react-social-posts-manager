type Post = {
  _id?: Mongoose.ObjectId | string
  title: string
  body: string
  userId?: Mongoose.ObjectId | string
}

type PostResource = {
  _id?: Mongoose.ObjectId | string
  title: string
  body: string
}

type PostResourceWithLike = PostResource & {
  isLiked: boolean
}
