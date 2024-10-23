import { postScoreModel } from '~/models/postScoreModel';
import { postsModel } from '~/models/postsModel';

const createNew = async (userId, fileLink, caption) => {
  try {
    if (caption) {
      const createPost = await postsModel.createNew(userId, fileLink, caption);
    }
    const createPost = await postsModel.createNew(userId, fileLink);

    return createPost;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllPost = async () => {
  try {
    const response = await postsModel.getAllPost();
    return response;
  } catch (error) {
    throw new Error('Error in postService.getAllPost: ' + error.message);
  }
};

const likePost = async (post_id, userLike_id) => {
  const response = await postScoreModel.createNew(post_id, userLike_id);
  return response;
};
const countLike = async (post_id, userLike_id) => {
  const countLike = await postScoreModel.checkPostwithPostId(post_id);
  return countLike;
};
export const postService = {
  createNew,
  getAllPost,
  likePost,
  countLike,
};
