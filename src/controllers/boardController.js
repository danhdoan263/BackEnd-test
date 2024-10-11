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
export const boardController = {
    createNew
}