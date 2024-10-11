import { boardModel } from "~/models/boardModel"
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



export const boardService = {
    createNew
}