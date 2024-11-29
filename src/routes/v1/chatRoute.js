import express from 'express';
import { chatController } from '~/controllers/chatController';

const Route = express.Router();

Route.route('/').post(chatController.createNew);
export const chatRoute = Route;
