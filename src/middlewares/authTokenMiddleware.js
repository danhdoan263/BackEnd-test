import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { env } from "~/config/environment"

const authTokenMiddleware = (req, res, next) => {
    const getToken = req.headers['token']
    const token = getToken.split(' ')[1]
    console.log(req.user);

    try {
        const decoded = jwt.verify(token, env.SECRET_TOKEN);
        req.user = decoded.userId
        console.log(req.user);

    } catch (error) {
        return res.status(StatusCodes.FORBIDDEN).json({
            code: 403,
            message: 'invalid token!'
        })

    }

}

export default authTokenMiddleware