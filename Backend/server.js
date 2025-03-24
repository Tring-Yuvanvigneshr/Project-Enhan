require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { ApolloServer } = require("@apollo/server")
const { expressMiddleware } = require("@apollo/server/express4")
const typeDefs = require("./src/graphql/typeDef")
const resolvers = require("./src/graphql/resolvers")
const otpRoutes = require("./src/routes/otp");

const app = express()
app.use(express.json())

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions))


const apolloServer = new ApolloServer({
  typeDefs, 
  resolvers
})

async function startApolloServer() {
  await apolloServer.start()
  app.use("/graphql", expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      // const user = authenticateUser(req)
      // console.log(req)
      return req 
    }
  }))

  app.use("/api", otpRoutes)

  app.listen('5000', () => {
    console.log('server started')
  })
}

startApolloServer()
