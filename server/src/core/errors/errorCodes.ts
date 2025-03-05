const Generic = 'GEN'
const User = 'USER'
const Post = 'POST'

export default {
  GENERIC_ERROR: {
    code: `${Generic}0001`,
    userTitle: 'Something went wrong',
    userMessage: 'Something went wrong! Please try again later.',
    technicalDescription: 'An error occurred which is not mapped. This generic error is shown in that case.'
  },
  USERNAME_TAKEN: {
    code: `${User}0001`,
    userTitle: 'Username Unavailable',
    userMessage: 'This username is already taken. Please choose another one.',
    technicalDescription: 'The provided username already exists in the database.'
  },
  EMAIL_ALREADY_REGISTERED: {
    code: `${User}0002`,
    userTitle: 'Email Already Registered',
    userMessage: 'An account with this email already exists.',
    technicalDescription: 'The provided email is already registered in the system.'
  },
  USER_NOT_FOUND: {
    code: `${User}0003`,
    userTitle: 'User Not Found',
    userMessage: 'No user found with the provided details.',
    technicalDescription: 'The system could not find a user matching the given credentials.'
  },
  INVALID_CREDENTIALS: {
    code: `${User}0004`,
    userTitle: 'Invalid Credentials',
    userMessage: 'The username or password is incorrect.',
    technicalDescription: 'The provided credentials do not match any user in the database.'
  },
  INVALID_EMAIL: {
    code: `${User}0005`,
    userTitle: 'Invalid Email',
    userMessage: 'Please provide a valid email address.',
    technicalDescription: 'The email format provided is incorrect.'
  },
  WEAK_PASSWORD: {
    code: `${User}0006`,
    userTitle: 'Weak Password',
    userMessage:
      'Password must be at least 8 characters long, contain uppercase, lowercase, a number, and a special character.',
    technicalDescription: 'The provided password does not meet security requirements.'
  },
  MISSING_POST_FIELDS: {
    code: `${Post}0001`,
    userTitle: 'Missing Required Fields',
    userMessage: 'Post title and body are required.',
    technicalDescription: 'Either the post title or body is missing.'
  },
  POST_NOT_FOUND: {
    code: `${Post}0002`,
    userTitle: "Post Not Found",
    userMessage: "The requested post does not exist.",
    technicalDescription: "The post ID provided does not match any post in the database.",
  }
}
