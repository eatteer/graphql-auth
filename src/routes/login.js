import jwt from 'jsonwebtoken'
import { data } from '../data/data.js'
import { SECRET } from '../jwt/config.js'

export const login = (req, res) => {
  const { username, password } = req.body
  const user = data.users.find(user =>
    user.username === username && user.password === password
  )
  if (!user) throw new Error('Invalid credentials')
  const payload = {
    sub: user.id,
    username: user.username
  }
  const token = jwt.sign(payload, SECRET)
  res.json({ token })
}