/* Express related */
import express from 'express'

/* GraphQL related */
import { ApolloServer } from 'apollo-server-express'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { applyMiddleware } from 'graphql-middleware'
import { typeDefs } from './graphql/typeDefs.js'
import { resolvers } from './graphql/resolvers.js'
import { permissions } from './graphql/permissions.js'

/* Routes */
import { login } from './routes/login.js'
import { validateJwtIfExists } from './middlewares/validateJwtIfExits.js'

/* Setup server */
const PORT = process.env.PORT || 5000


/* FOR LEARING PURPOSES (TRYING grahpql-middleware) */
const middlewareTest = (resolve, parent, args, context, info) => {
  console.log('I am the last [middlewareTest]!')
  const result = resolve(parent, args, context, info)
  return result
}

const testMiddlewares = {
  Query: {
    allUsers: middlewareTest
  }
}
/* FOR LEARING PURPOSES (TRYING grahpql-middleware) */

/* Setup GraphQL Schema */
const schema = makeExecutableSchema({ typeDefs, resolvers })

/* Create Apollo Application */
const apolloServer = new ApolloServer({
  schema: applyMiddleware(schema, permissions.generate(schema), testMiddlewares),
  // schema: applyMiddleware(schema, middlewares),
  context: ({ req }) => {
    const payload = req.auth ?? null
    return { payload }
  }
})

/* Create Express Application */
const app = express()

/* Setup Middlewares */
app.use(express.json())
app.use(validateJwtIfExists())

/* Routes */
app.use('/login', login)

/* Start server */
await apolloServer.start().then(() => {
  /* Inject Apollo Application as Express Middleware for /graphql endpoint */
  apolloServer.applyMiddleware({ app })
  app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`)
  })
})
