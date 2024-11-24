import express from 'express';
import { chatController } from '~/controllers/chatController';

const Route = express.Router();

Route.route('/createChat').post(chatController.createNew);
Route.route('/chat').get(chatController.sendMessage);
export const chatRoute = Route;
