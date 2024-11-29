import { StatusCodes } from 'http-status-codes';
import authTokenMiddleware from '~/middlewares/authTokenMiddleware';
import { userService } from '~/services/userService';
import ApiError from '~/utils/ApiError';
import { OBJECT_ID_RULE } from '~/utils/validators';

const createNew = async (req, res, next) => {
  try {
    console.log(req.body);

    const createdUser = await userService.createNew(req.body);

    res.status(StatusCodes.CREATED).json(createdUser);
  } catch (error) {
    throw new Error(error);
  }
};
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: StatusCodes.BAD_REQUEST,
        message: `${username || password} is required`,
      });
    }
    const response = await userService.login(username, password);
    console.log(response);

    if (response.error) {
      return res.status(StatusCodes.BAD_GATEWAY).json({
        message: response.message,
      });
    }
    return res.status(StatusCodes.OK).json({
      token: response.token,
      _id: response._id,
      email: response.email,
      username: response.username,
      full_name: response.full_name,
      profile_url_img: response.profile_url_img,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getDetails = async (req, res) => {
  try {
    const { userId } = req.query;

    const respone = await userService.getUserById(userId);

    if (respone) {
      res.status(StatusCodes.OK).json({
        User: respone,
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        User: 'bad request ',
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const followAnUser = async (req, res) => {
  const user_id = req.body.user_id;
  const otherUser_id = req.body.otherUser_id;

  try {
    if (user_id == null || otherUser_id == null) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: 'something invalid id',
        user_id: user_id,
        otherUser_id: otherUser_id,
      });
    }

    const getUserFollowed = await userService.getUserFollower(user_id);
    const checkUserFollowExits = getUserFollowed.some((follower) => {
      if (follower.following_id === otherUser_id) {
        return true;
      }
    });
    if (checkUserFollowExits) {
      return res.status(StatusCodes.CONFLICT).json({
        message: `followed user ${otherUser_id} yet`,
      });
    }

    const response = await userService.followingUser(user_id, otherUser_id);
    if (response) {
      return res.status(StatusCodes.OK).json({
        message: `successfully following ${otherUser_id}`,
        code: StatusCodes.OK,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const checkIdRule = (id) => {
  if (OBJECT_ID_RULE.test(id)) {
    return true;
  }
  return false;
};
const unFollowAnUser = async (req, res) => {
  try {
    const { user_id, otherUser_id } = req.query;
    console.log(user_id, otherUser_id);

    if (checkIdRule(user_id) && checkIdRule(otherUser_id) === true) {
      const response = await userService.unFollowAnUser(user_id, otherUser_id);
      console.log(response);
      res.status(StatusCodes.OK).json({
        message: `unfollow user ${otherUser_id}`,
        response: response,
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        user_id: user_id,
        otherUser_id: otherUser_id,
        message: `id not in format rule`,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getUserFollower = async (req, res) => {
  const { user_id } = req.query;
  const response = await userService.getUserFollower(user_id);
  const listUserFollowedId = [];
  response.map((userfollowing_id) => {
    listUserFollowedId.push(userfollowing_id.following_id);
  });
  const result = await userService.getUserById(listUserFollowedId);
  const resultRmPw = result.map(({ password, ...rest }) => rest);
  res.status(StatusCodes.OK).json({
    follower: resultRmPw,
  });
};

const getListUserByUsername = async (req, res) => {
  try {
    const username = req.query.searchUser;
    const user_id = req.query.user_id;
    const getListUser = await userService.getListUserByUsername(username);
    const getListUserRmPwd = getListUser.map(({ password, ...rest }) => rest);
    const getUserFolowerById = await userService.getUserFollower(user_id);

    console.log('getListUser: ', getListUser);
    console.log('getUserFolowerById: ', getUserFolowerById);

    const updatedUserList = getListUserRmPwd.map((user) => {
      const isFollowed = getUserFolowerById.some(
        (f) => f.following_id === user._id.toString() && f.followed === true
      );

      return {
        ...user,
        followed: isFollowed,
      };
    });

    console.log('updatedUserList', updatedUserList);

    res.status(StatusCodes.OK).json({
      userList: updatedUserList,
    });
  } catch (error) {}
};

export const userController = {
  createNew,
  login,
  getDetails,
  followAnUser,
  unFollowAnUser,
  getUserFollower,
  getListUserByUsername,
};
