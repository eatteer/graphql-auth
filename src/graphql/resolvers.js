import { data } from '../data/data.js'

export const resolvers = {
  Query: {
    me: (parent, args, context) => {
      const user = data.users.find(user => user.id === context?.payload?.sub)
      return user
    },
    user: (parent, args, context) => {
      const user = data.users.find(user => user.id === args.id)
      return user
    },
    allUsers: (parent, args, context) => {
      return data.users
    }
  }
}