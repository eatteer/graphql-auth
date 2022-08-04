/* Express related */
import express from 'express'
import { expressjwt } from 'express-jwt'

/* GraphQL related */
import { ApolloServer } from 'apollo-server-express'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { applyMiddleware } from 'graphql-middleware'
import { typeDefs } from './graphql/typeDefs.js'
import { resolvers } from './graphql/resolvers.js'
import { permissions } from './graphql/permissions.js'

import { login } from './routes/login.js'
import { SECRET } from './jwt/config.js'

/* Setup server */
const PORT = process.env.PORT || 5000
const expressJwtConfig = {
  secret: SECRET,
  algorithms: ["HS256"],
  credentialsRequired: false
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

/* Create Apollo Application */
const apolloServer = new ApolloServer({
  schema: applyMiddleware(schema, permissions.generate(schema)),
  context: ({ req }) => {
    const payload = req.auth ?? null
    return { payload }
  }
})

/* Create Express Application */
const app = express()

/* Setup Middlewares */
app.use(express.json())
app.use(expressjwt(expressJwtConfig))

/* Routes */
app.use('/login', login)

await apolloServer.start().then(() => {
  /* Inject Apollo Application as Express Middleware */
  apolloServer.applyMiddleware({ app })
  /* Run server */
  app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`)
  })
})
