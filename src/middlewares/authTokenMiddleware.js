import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { env } from '~/config/environment';

const authTokenMiddleware = (req, res, next) => {
  const getToken = req.headers['token'];
  console.log('token: ', getToken);

  if (!getToken) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: 'token invalid',
    });
  }
  try {
    const decoded = jwt.verify(getToken, env.SECRET_TOKEN);
    console.log('userId: ', decoded);

    req.user = decoded.userId;
    next();
  } catch (error) {
    return res.status(StatusCodes.FORBIDDEN).json({
      code: 403,
      message: 'invalid token!',
    });
  }
};

export default authTokenMiddleware;
