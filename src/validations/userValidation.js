import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/ApiError";


const createNew = async (req, res, next) => {
    const validateData = Joi.object({
        username: Joi.string().required().min(3).max(50).trim().strict(),
        email: Joi.string().required().min(3).max(254).trim().strict(),
        password: Joi.string().required().min(3).trim().strict(),
        full_name: Joi.string().required().min(3).max(100).trim().strict(),
        bio: Joi.string().trim().strict(),
        profile_url_img: Joi.string().trim().strict(),
    })
    try {
        await validateData.validateAsync(req.body, ({ abortEarly: false }))
        // throw new Error('API: validate data from board validate')
        next()

    } catch (error) {
        const errorMessage = new Error(error).message
        const customError = new ApiError(StatusCodes.BAD_GATEWAY, errorMessage)
        next(customError)// gửi cái error này sang cho bên middleware
    }
}

export const userValidation = {
    createNew
}