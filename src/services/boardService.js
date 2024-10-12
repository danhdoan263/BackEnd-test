import { StatusCodes } from "http-status-codes"
import { boardModel } from "~/models/boardModel"
import ApiError from "~/utils/ApiError"
import { slugify } from "~/utils/slugtify"

const createNew = async (reqBody) => {
    try {
        const newBoard = {
            ...reqBody,
            slug: slugify(reqBody.title)
        }
        const createData = await boardModel.createNew(newBoard)
        const findDataById = await boardModel.findOneById(createData.insertedId.toString())
        return findDataById
    } catch (error) {
        throw error
    }
}

const getDetails = async (boardId) => {
    try {
        const getDetails = await boardModel.getDetails(boardId)
        if (!getDetails) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
        }
        return getDetails
    } catch (error) {
        throw new Error(error)
    }
}

export const boardService = {
    createNew,
    getDetails
}