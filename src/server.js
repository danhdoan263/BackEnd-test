import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { corsOptions } from '~/config/cors';
import { env } from '~/config/environment';
import { CONNECT_DB } from '~/config/mongodb';
import { errorHandlingMiddleware } from '~/middlewares/errHandlingMiddleware';
import { API_v1 } from '~/routes/v1';
import { WebSocket } from 'ws';
import { createServer } from 'http';
import { chatController } from '~/controllers/chatController';

const getAllMessage = async (data) => {
  return await chatController.getMessages(data);
};
const insertMessage = async (data) => {
  return await chatController.saveMessage(data);
};

const START_SERVER = () => {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocket.Server({ server: server });

  const roomConnection = [];
  const checkConnect = {
    hello: 'connection send to you a message',
  };
  wss.on('connection', function connection(ws) {
    ws.on('message', async (message) => {
      const recieveData = JSON.parse(message);

      if (recieveData.roomId) {
        ws.roomId = recieveData.roomId;
        roomConnection.push(ws);
      }
      console.log(roomConnection.length);

      console.log('recieveData: ', recieveData);

      if (recieveData.getMessageFromModel && recieveData.roomId) {
        const getMesage = await getAllMessage(recieveData);
        ws.send(JSON.stringify(getMesage));
      }
      if (recieveData.sendMessage) {
        const insertMessageToModel = await insertMessage(recieveData);
        console.log(insertMessageToModel);
        const getNewMesage = await getAllMessage(recieveData);
        roomConnection.forEach((room) => {
          if (room.roomId === recieveData.roomId) {
            room.send(JSON.stringify(getNewMesage));
          }
        });
      }
    });
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

  server.listen(env.APP_PORT, env.APP_HOST, () => {
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
