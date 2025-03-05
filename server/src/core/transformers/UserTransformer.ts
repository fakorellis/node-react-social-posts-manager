import { Types } from 'mongoose'

class UserTransformer {
  /**
   * Transforms a single User object into a UserResource.
   * Removes sensitive fields like password.
   * @param user - The user to transform.
   * @returns A transformed UserResource.
   */
  static getView(user: User): UserResource {
    return {
      _id: user._id ? new Types.ObjectId(user._id).toString() : undefined,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      username: user.username
    }
  }

  /**
   * Transforms a list of User objects into UserResource[].
   * Calls getView() for each user.
   * @param users - The list of users to transform.
   * @returns A transformed list of UserResources.
   */
  static getViewList(users: User[]): UserResource[] {
    return users.map((user) => this.getView(user))
  }
}

export default UserTransformer
