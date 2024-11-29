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
const createNew = async (user_id, otherUser_id) => {
  try {
    const response = await getRoomByUserId(user_id, otherUser_id);
    if (!response) {
      const newData = {
        userIDs: [user_id, otherUser_id],
      };
      const valid = await validateData(newData);

      return await GET_DB().collection(ROOM_SCHEMA_NAME).insertOne(valid);
    } else {
      return response;
    }
  } catch (error) {
    console.error(error);
  }
};
const getRoomByUserId = async (userId1, userId2) => {
  const room = await GET_DB()
    .collection(ROOM_SCHEMA_NAME)
    .findOne({
      userIDs: { $all: [userId1, userId2] },
    });

  return room;
};

const checkRoomExits = async (roomId, sender, otherUser_id) => {
  const roomIdx = new ObjectId(roomId);
  const response = await GET_DB()
    .collection(ROOM_SCHEMA_NAME)
    .findOne({
      _id: roomIdx,
      userIDs: { $all: [sender, otherUser_id] },
    });

  return response;
};

export const roomModel = {
  createNew,
  getRoomByUserId,
  checkRoomExits,
};
