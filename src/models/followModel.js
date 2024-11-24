const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { GET_DB } = require('~/config/mongodb');
const {
  OBJECT_ID_RULE_MESSAGE,
  OBJECT_ID_RULE,
} = require('~/utils/validators');

const FOLLOW_MODEL_NAME = 'followModel';
const FOLLOW_MODEL_SCHEMA = Joi.object({
  follower_id: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  following_id: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  followed: Joi.boolean().default(true),
  follow_at: Joi.date().timestamp('javascript').default(Date.now()),
});

const validData = async (data) => {
  try {
    if (!data) {
      return `data is ${data}`;
    }
    return await FOLLOW_MODEL_SCHEMA.validateAsync(data, { abortEarly: false });
  } catch (error) {
    console.log('error in followModel', error);
  }
};

const insertFollow = async (user_id, otherUser_id) => {
  try {
    const followData = {
      follower_id: user_id,
      following_id: otherUser_id,
    };
    const dataInsert = await validData(followData);
    return await GET_DB().collection(FOLLOW_MODEL_NAME).insertOne(dataInsert);
  } catch (error) {
    console.log('error in followModel', error);
  }
};

const unFollowAnUser = async (user_id, otherUser_id) => {
  try {
    const response = await GET_DB().collection(FOLLOW_MODEL_NAME).deleteOne({
      follower_id: user_id,
      following_id: otherUser_id,
    });
    return response;
  } catch (error) {
    console.log('error in followModel', error);
  }
};

const getFollowById = async (data) => {
  try {
    const getFollow = await GET_DB()
      .collection(FOLLOW_MODEL_NAME)
      .find({
        follower_id: data,
      })
      .toArray();

    return getFollow;
  } catch (error) {
    console.log('error in followModel', error);
  }
};

export const followModel = {
  getFollowById,
  insertFollow,
  unFollowAnUser,
};
