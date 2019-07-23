import jwt from 'jsonwebtoken'

function generateToken(userid) {
  return jwt.sign({ userid }, 'thisisasecret', { expiresIn: '7 days' })
}

export { generateToken as default }
