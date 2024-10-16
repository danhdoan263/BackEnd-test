import { StatusCodes } from "http-status-codes";
import authTokenMiddleware from "~/middlewares/authTokenMiddleware";
import { userService } from "~/services/userService";

const createNew = async (req, res, next) => {
    try {

        const createdUser = await userService.createNew(req.body)

        res.status(StatusCodes.CREATED).json(createdUser);

    } catch (error) {
        throw new Error(error)

    }
}
const login = async (req, res) => {
    const { username, password } = req.body
    try {

        const response = await userService.login(username, password)
        if (response.error) {
            return res.status(StatusCodes.BAD_GATEWAY).json({
                message: response.message
            })
        }
        return res.status(StatusCodes.OK).json({
            token: response.token
        })
    } catch (error) {
        throw new Error(error)
    }
}

export const userController = {
    createNew,
    login
}