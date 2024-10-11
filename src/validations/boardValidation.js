import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/ApiError";


const createNew = async (req, res, next) => {
    const validateData = Joi.object({
        title: Joi.string().required().min(3).max(25).trim().strict(),
        description: Joi.string().required().max(255).trim().strict()
    })
    try {
        await validateData.validateAsync(req.body, ({ abortEarly: false }))
        // throw new Error('API: validate data from board validate')
        console.log('from validation board', req.body)
        next()

    } catch (error) {
        const errorMessage = new Error(error).message
        const customError = new ApiError(StatusCodes.BAD_GATEWAY, errorMessage)
        next(customError)// gửi cái error này sang cho bên middleware
    }
}

export const boardValidation = {
    createNew
}