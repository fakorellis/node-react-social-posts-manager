import posts from './posts'
import status from './status'
import users from './users'

export default {
  ...status,
  ...users,
  ...posts
}
