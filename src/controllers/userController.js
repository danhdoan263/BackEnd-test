import { StatusCodes } from "http-status-codes";
import authTokenMiddleware from "~/middlewares/authTokenMiddleware";
import { userService } from "~/services/userService";
import ApiError from "~/utils/ApiError";

const createNew = async (req, res, next) => {
    try {

        const createdUser = await userService.createNew(req.body)

        res.status(StatusCodes.CREATED).json(createdUser);

    } catch (error) {
        throw new Error(error)

    }
}
const login = async (req, res) => {
    console.log("requeét body", req.body);

    const { username, password } = req.body
    try {

        if (!username || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: StatusCodes.BAD_REQUEST,
                message: `${username || password} is required`
            })
        }
        const response = await userService.login(username, password)
        console.log(response);

        if (response.error) {
            return res.status(StatusCodes.BAD_GATEWAY).json({
                message: response.message
            })
        }
        return res.status(StatusCodes.OK).json({
            token: response.token,
            _id: response._id,
            email: response.email,
            username: response.username,
            full_name: response.full_name,
            profile_url_img: response.profile_url_img
        })
    } catch (error) {
        throw new Error(error)
    }
}

const getDetails = async (req, res) => {
    log(req.body)
    try {
        const respone = await userService.getDetails(userId)
    } catch (error) {

    }
}

export const userController = {
    createNew,
    login,
    getDetails
}