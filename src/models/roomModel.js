import { ObjectId } from 'mongodb';

const Joi = require('joi');
const { GET_DB } = require('~/config/mongodb');
const {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} = require('~/utils/validators');

const ROOM_SCHEMA_NAME = 'roomModel';
const ROOM_SCHEMA_SCHEMA = Joi.object({
  userIDs: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
});

const validateData = async (newData) => {
  return await ROOM_SCHEMA_SCHEMA.validateAsync(newData, {
    abortEarly: false,
  });
};

//create room when user active room chat first time
const createNew = async (data) => {
  try {
    const { userId1, userId2 } = data;
    const response = await getRoomByUserId(data);
    if (!response) {
      const newData = {
        userIDs: [userId1, userId2],
      };
      const valid = await validateData(newData);
      console.log(valid);

      return await GET_DB().collection(ROOM_SCHEMA_NAME).insertOne(valid);
    } else {
      return response;
    }
  } catch (error) {
    console.error(error);
  }
};
const getRoomByUserId = async (data) => {
  const { userId1, userId2 } = data;
  const room = await GET_DB()
    .collection(ROOM_SCHEMA_NAME)
    .findOne({
      userIDs: { $all: [userId1, userId2] },
      $expr: { $eq: [{ $size: '$userIDs' }, 2] },
    });

  return room || false;
};

const checkRoomExits = async (roomId, sender, message) => {
  console.log('roomId', roomId);

  const roomIdx = new ObjectId(roomId);
  const response = await GET_DB().collection(ROOM_SCHEMA_NAME).findOne({
    _id: roomIdx,
  });
  console.log(response);

  return response;
};
export const roomModel = {
  createNew,
  getRoomByUserId,
  checkRoomExits,
};
