import { graphqlSchema } from './common'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express, { Application } from 'express'
import { graphqlHTTP } from 'express-graphql'
import root from './root'
dotenv.config()

if (!process.env.MONGODB_HOST) {
  throw 'MONGODB_HOST undefined'
}

const app = express()
app.use(cors())
// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema: graphqlSchema,
//     rootValue: root,
//     graphiql: true,
//     customFormatErrorFn: (error) => ({
//       message: error.message,
//       locations: error.locations,
//       stack: error.stack ? error.stack.split('\n') : [],
//       path: error.path,
//     }),
//   }) as Application
// )
app.get('/', function (req, res) {
  res.send('Hello World')
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`mongodb running on PORT: ${port}`))
