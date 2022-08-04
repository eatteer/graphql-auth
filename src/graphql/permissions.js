import { data } from "../data/data.js"
import { shield, rule, and, allow } from "graphql-shield"

const checkPermission = (userId, permission) => {
  const user = data.users.find(user => user.id === userId)
  return user.permissions.includes(permission)
}

const canGetAllUsers = rule()((parent, args, context) => {
  const userId = context.payload.sub
  return checkPermission(userId, 'get:all_users')
})

const isAuthenticated = rule()((parent, args, context) => {
  /* [user] is different of null, then [true] else [false] */
  return context.payload !== null
})

export const permissions = shield({
  Query: {
    me: allow,
    user: allow,
    allUsers: and(isAuthenticated, canGetAllUsers)
  }
})