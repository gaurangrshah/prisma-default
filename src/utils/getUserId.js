import jwt from 'jsonwebtoken'

const getUserId = (request) => {

  const header = request.request.headers.authorization

  if (!header) throw new Error("Authentication required");

  const token = header.replace('Bearer ', '')
  // removes the term "Bearer " from the token, NOTE the space after "Bearer "

  const decoded = jwt.verify(token, 'thisisasecret')

  return decoded.userId

}

export { getUserId as default }
