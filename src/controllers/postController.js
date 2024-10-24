import { StatusCodes } from 'http-status-codes';
import { postService } from '~/services/postService';
import { userService } from '~/services/userService';

const getAllPost = async (req, res, next) => {
  const response = await postService.getAllPost();

  //get user id without duplicate by ...new Set
  const userids = [...new Set(response.map((response) => response.user_id))];

  // after get post get info post's user by list id
  const postuser = await userService.getUserById(userids);

  const nameAndIds = postuser.reduce((acc, user) => {
    acc[user._id.toString()] = {
      full_name: user.full_name,
      profile_url_img: user.profile_url_img,
    };
    return acc;
  }, {});

  //insert full name to post by id
  const data = response.map((post) => {
    const inserName = nameAndIds[post.user_id] || 'unknow user';
    return {
      ...post,
      ...inserName,
    };
  });

  //If there is a response from the service (data is not empty)
  if (response && response.length > 0) {
    return res.status(StatusCodes.OK).json({
      message: 'Query successful',
      data: data,
    });
  }

  // Empty response case
  return res.status(StatusCodes.NOT_FOUND).json({
    message: 'No posts found',
    data: [],
  });
};

//in like post get user_id from auth token and get post_id from params
const likePost = async (req, res, next) => {
  const { post_id } = req.query;

  const userLike_id = req.user;

  //update like to userList
  const response = await postService.likePost(post_id, userLike_id);

  if (response) {
    res.status(StatusCodes.OK).json({
      message: 'like post successfully',
      info: response,
    });
  }
};
const getLikePost = async (req, res) => {
  //count likes in post = user_id in userList
  const { post_id } = req.query;
  const countLike = await postService.countLike(post_id);
  if (countLike) {
    res.status(StatusCodes.OK).json({
      message: 'like post successfully',
      likes: countLike.userList.length,
    });
  }
};

export const postController = {
  getAllPost,
  likePost,
  getLikePost,
};
