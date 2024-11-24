import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { corsOptions } from '~/config/cors';
import { env } from '~/config/environment';
import { CONNECT_DB } from '~/config/mongodb';
import { errorHandlingMiddleware } from '~/middlewares/errHandlingMiddleware';
import { API_v1 } from '~/routes/v1';
import { Server } from 'socket.io';
import { createServer } from 'http';

const START_SERVER = () => {
  const app = express();

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: corsOptions,
  });

  app.use(cors(corsOptions));
  app.use(express.json());

  app.get('/', (req, res) => {
    // Test Absolute import mapOrder
    res.end('<h1>Hello World!</h1><hr>');
  });
  // user upload static file to public get
  app.use('/uploads', express.static('D:/uploads'));
  //user api route
  app.use('/v1', API_v1);

  app.use(errorHandlingMiddleware);

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log('a user connected', userId);
  });

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`3. server running at: ${env.APP_HOST}:${env.APP_PORT}/`);
  });
};

// anonymus function
(async () => {
  try {
    console.log('1. connect to database ');
    await CONNECT_DB();
    console.log('2. connect database successfully');
    START_SERVER();
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
})();
