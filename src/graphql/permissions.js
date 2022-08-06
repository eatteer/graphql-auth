import { data } from "../data/data.js"
import { shield, rule, and, allow } from "graphql-shield"

const checkPermission = (userId, permission) => {
  const user = data.users.find(user => user.id === userId)
  return user.permissions.includes(permission)
}

const isAuthenticated = rule()((parent, args, context) => {
  /* [user] is different of null, then [true] else [false] */
  console.log('First me [isAuthenticated]!')
  return context.payload !== null
})

const canGetAllUsers = rule()((parent, args, context) => {
  console.log('Then me [canGetAllUsers]!')
  const userId = context.payload.sub
  return checkPermission(userId, 'get:all_users')
})

export const permissions = shield({
  Query: {
    me: allow,
    user: allow,
    allUsers: and(isAuthenticated, canGetAllUsers)
  }
})