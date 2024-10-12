import { StatusCodes } from "http-status-codes";
import { boardService } from "~/services/boardService";

const createNew = async (req, res, next) => {
    try {

        const createdBoard = await boardService.createNew(req.body)

        res.status(StatusCodes.CREATED).json(createdBoard);

    } catch (error) {
        console.log('error from controller: ', error);

    }
}
const getDetails = async (req, res, next) => {
    const boardId = req.params.id
    const getDetails = await boardService.getDetails(boardId)

    res.status(StatusCodes.OK).json(getDetails)
}

export const boardController = {
    createNew,
    getDetails
}