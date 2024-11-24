import { userModel } from '~/models/usersModel';
import jwt from 'jsonwebtoken';
import { env } from '~/config/environment';
import { followModel } from '~/models/followModel';
const createNew = async (reqBody) => {
  try {
    const createNewUser = await userModel.createNew(reqBody);
    return createNewUser;
  } catch (error) {
    throw new Error(error);
  }
};

// jwt login user

const login = async (username, password) => {
  try {
    const checkUser = await userModel.findUsername(username);

    if (!checkUser) {
      return {
        error: true,
        message: 'wrong username',
      };
    }
    if (checkUser.password !== password) {
      return {
        error: true,
        message: 'wrong password',
      };
    }
    const token = jwt.sign({ userId: checkUser._id }, env.SECRET_TOKEN, {
      expiresIn: '2d',
    });

    return { error: false, token, ...checkUser };
  } catch (error) {
    throw new Error(error);
  }
};

//get info user for post
const getUserById = async (userid) => {
  const getUser = await userModel.getUserByIds(userid);
  return getUser;
};

const getUserFollower = async (data) => {
  try {
    return await followModel.getFollowById(data);
  } catch (error) {
    throw new Error(error);
  }
};

const followingUser = async (user_id, otherUser_id) => {
  try {
    return await followModel.insertFollow(user_id, otherUser_id);
  } catch (error) {
    throw new Error(error);
  }
};

const unFollowAnUser = async (user_id, otherUser_id) => {
  try {
    return await followModel.unFollowAnUser(user_id, otherUser_id);
  } catch (error) {
    throw new Error(error);
  }
};

const getListUserByUsername = async (Username) => {
  try {
    return await userModel.getListUserByUsername(Username);
  } catch (error) {
    throw new Error(error);
  }
};

export const userService = {
  createNew,
  login,
  getUserById,
  getListUserByUsername,
  getUserFollower,
  followingUser,
  unFollowAnUser,
};
