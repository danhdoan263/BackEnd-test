import { ObjectId } from 'mongodb';

const Joi = require('joi');
const { GET_DB } = require('~/config/mongodb');
const {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} = require('~/utils/validators');

const USER_COLLECTION_NAME = 'users';
const USER_COLLECTION_SCHEMA = Joi.object({
  user_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  username: Joi.string().required().min(3).max(50).trim().strict(),
  email: Joi.string().required().min(3).max(254).trim().strict(),
  password: Joi.string().required().min(3).trim().strict(),
  full_name: Joi.string().required().min(3).max(100).trim().strict(),
  bio: Joi.string().trim().strict(),
  profile_url_img: Joi.string().trim().strict(),
  created_at: Joi.date().timestamp('javascript').default(Date.now),
  destroy_at: Joi.date().timestamp('javascript').default(Date.now),
});

const validData = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

//validate and created success
const createNew = async (reqBody) => {
  try {
    const validDataBeforeCreate = await validData(reqBody);
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(validDataBeforeCreate);
  } catch (error) {
    throw new Error(error);
  }
};

//find username
const findUsername = async (username) => {
  return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ username });
};

//set avatar for user
const setAvatar = async (userId, UrlPath) => {
  const idx = new ObjectId(userId);
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne(
      { _id: idx },
      {
        $set: {
          profile_url_img: UrlPath,
        },
      }
    );
};

// get username by id for post
const getUserByIds = async (userids) => {
  const objectids = userids.map((id) => new ObjectId(id));

  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .find({ _id: { $in: objectids } })
    .toArray();
};

const getListUserByUsername = async (Username) => {
  try {
    const listUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .find({
        username: { $regex: Username, $options: 'i' },
      })
      .toArray();

    return listUser;
  } catch (error) {
    console.log('error get listUser from usermodel: ', error);
  }
};

export const userModel = {
  createNew,
  findUsername,
  getUserByIds,
  setAvatar,
  getListUserByUsername,
};
