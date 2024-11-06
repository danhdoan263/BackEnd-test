import express from 'express';
import { postController } from '~/controllers/postController';
import { uploadController } from '~/controllers/uploadController';
import authTokenMiddleware from '~/middlewares/authTokenMiddleware';
const Router = express.Router();

Router.route('/create').post(
  authTokenMiddleware,
  uploadController.uploadSingle('photo'),
  (req, res, next) => {
    const action = 'post';
    uploadController.uploadManifest(req, res, next, action);
  }
);

Router.route('/delete').post(authTokenMiddleware, postController.deletePost);

Router.route('/getAllPost').get(postController.getAllPost);

Router.route('/like')
  .get(authTokenMiddleware, postController.getLikePost)
  .post(authTokenMiddleware, postController.likePost);

Router.route('/comment')
  .get(postController.findCommentByPostId)
  .post(postController.creteNewComment);

export const postRouter = Router;
