import { ObjectId } from 'mongodb';

const Joi = require('joi');
const { GET_DB } = require('~/config/mongodb');
const {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} = require('~/utils/validators');

const MESSAGE_MODEL_NAME = 'messageModel';
const MESSAGE_MODEL_SCHEMA = Joi.object({
  roomId: Joi.string()
    .trim()
    .strict()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  sender: Joi.string().min(1).max(60).trim().strict().required(),
  message: Joi.string().required().trim().strict(),
  timestamp: Joi.date().timestamp('javascript').default(Date.now()),
});

const validateData = async (newData) => {
  return await MESSAGE_MODEL_SCHEMA.validateAsync(newData, {
    abortEarly: false,
  });
};
const createNew = async (roomId, sender, message) => {
  try {
    const data = {
      roomId: roomId,
      sender: sender,
      message: message,
    };
    const validData = await validateData(data);
    return await GET_DB().collection(MESSAGE_MODEL_NAME).insertOne(validData);
  } catch (error) {
    console.error(error);
  }
};

const getMessage = async (data) => {
  const { roomId } = data;
  return await GET_DB().collection(MESSAGE_MODEL_NAME).find({
    roomId: roomId,
  });
};

export const messageModel = {
  createNew,
  getMessage,
};
