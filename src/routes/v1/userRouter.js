import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { uploadController } from '~/controllers/uploadController';
import { userController } from '~/controllers/userController';
import authTokenMiddleware from '~/middlewares/authTokenMiddleware';
import { userValidation } from '~/validations/userValidation';

const Router = express.Router();

//route accepted

Router.route('/').get((req, res) => {
  res.status(StatusCodes.ACCEPTED).json({
    message: 'register ready to use',
  });
});

Router.route('/login').post(userController.login);

Router.route('/register').get().post(userController.createNew);

//get details user
Router.route('/getDetails').get(authTokenMiddleware, userController.getDetails);
//upload avatar for user
Router.route('/uploads').post(
  authTokenMiddleware,
  uploadController.uploadSingle('photo'),
  (req, res, next) => {
    const action = 'avatar';
    uploadController.uploadManifest(req, res, next, action);
  }
);

Router.route('/search').get(
  authTokenMiddleware,
  userController.getListUserByUsername
);

Router.route('/follow')
  .post(authTokenMiddleware, userController.followAnUser)
  .get(authTokenMiddleware, userController.getUserFollower)
  .delete(authTokenMiddleware, userController.unFollowAnUser);

export const userRoute = Router;
