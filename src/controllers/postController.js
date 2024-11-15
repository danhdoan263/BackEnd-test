import { StatusCodes } from 'http-status-codes';
import { postService } from '~/services/postService';
import { userService } from '~/services/userService';

const getAllPost = async (req, res, next) => {
  try {
    const posts = await postService.getAllPost();
    if (!posts.length) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'No posts found', data: [] });
    }

    const userIds = [...new Set(posts.map((post) => post.user_id))];
    const users = await userService.getUserById(userIds);

    const userInfo = users.reduce((acc, user) => {
      acc[user._id.toString()] = {
        full_name: user.full_name,
        profile_url_img: user.profile_url_img,
      };
      return acc;
    }, {});

    const data = posts.map((post) => ({
      ...post,
      ...(userInfo[post.user_id] || { full_name: 'unknown user' }),
    }));

    res.status(StatusCodes.OK).json({ message: 'Query successful', data });
  } catch (error) {
    next(error);
  }
};

const likePost = async (req, res, next) => {
  const { post_id } = req.query;
  if (!post_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Post ID is required' });
  }

  const userLike_id = req.user;

  try {
    const response = await postService.likePost(post_id, userLike_id);
    const countLike = await postService.countLike(post_id);

    response
      ? res.status(StatusCodes.OK).json({
          message: 'like post successfully',
          info: response,
          likes: countLike.userList.length,
        })
      : res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Post not found or like action failed' });
  } catch (error) {
    next(error);
  }
};

const getLikePost = async (req, res) => {
  const { post_id } = req.query;

  try {
    const countLike = await postService.countLike(post_id);
    res.status(StatusCodes.OK).json({
      message: 'like post successfully',
      likes: countLike.userList.length,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error fetching like count' });
  }
};

const deletePost = async (req, res) => {
  const { post_id } = req.query;

  try {
    const [response, responseScore] = await Promise.all([
      postService.deletePost(post_id),
      postService.deletePostScore(post_id),
    ]);

    response.deletedCount !== 0
      ? res.status(StatusCodes.OK).json({
          message: `deleted post id:${post_id}`,
          code: StatusCodes.OK,
          response,
          postScore: responseScore,
        })
      : res.status(StatusCodes.NOT_FOUND).json({
          message: `post id: ${post_id} not found`,
          code: StatusCodes.NOT_FOUND,
          response,
          postScore: responseScore,
        });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error deleting post' });
  }
};

const creteNewComment = async (req, res) => {
  const data = req.body;
  const createCommentFn = data.parent_id
    ? postService.createNewReply
    : postService.creteNewComment;

  try {
    const response = await createCommentFn(data);
    res.status(StatusCodes.OK).json({ data, response });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error creating comment' });
  }
};

const deleteCommentById = async (req, res) => {
  try {
    const { comment_id } = req.query;
    const response = await postService.deleteCommentById(comment_id);
    if (response) {
      res.status(StatusCodes.OK).json({
        status: response,
        code: StatusCodes.OK,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const getAllComment = async (req, res) => {
  try {
    const response = await postService.getAllComment();
    response
      ? res.status(StatusCodes.OK).json({ comment: response })
      : res.status(StatusCodes.NOT_FOUND).json({ comment: 'not found' });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error fetching comments' });
  }
};

const findCommentByPostId = async (req, res) => {
  const { post_id } = req.query;

  try {
    const response = await postService.findCommentByPostId(post_id);
    res.status(StatusCodes.OK).json({ comment: response });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error fetching comments by post ID' });
  }
};

export const postController = {
  getAllPost,
  likePost,
  getLikePost,
  deletePost,
  creteNewComment,
  deleteCommentById,
  getAllComment,
  findCommentByPostId,
};
