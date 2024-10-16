
import express from 'express'
import { mapOrder } from '~/utils/sorts.js'
import 'dotenv/config'
import { StatusCodes } from 'http-status-codes'
import { GET_DB, CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { API_v1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errHandlingMiddleware'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
const START_SERVER = () => {
  const app = express()
  app.use(cors(corsOptions))
  app.use(express.json())


  app.get('/', (req, res) => {
    // Test Absolute import mapOrder
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.use('/v1', API_v1)

  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`3. server running at: ${env.APP_HOST}:${env.APP_PORT}/`)
  })
}


// anonymus function
(async () => {
  try {
    console.log('1. connect to database ');
    await CONNECT_DB()
    console.log('2. connect database successfully');
    START_SERVER()
  } catch (error) {
    console.log(error);
    process.exit(0)
  }
})()