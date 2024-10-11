import Joi, { string } from "joi";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";

const BOARD_COLLECTION_NAME = 'Boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    slug: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(50).trim().strict(),
    cloumnOrderIds: Joi.array().items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ).default([]),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    _destroy: Joi.boolean().default(false),
})
const validData = async (data) => {
    try {
        return await BOARD_COLLECTION_SCHEMA.validateAsync(data, ({ abortEarly: false }))
    } catch (error) {
        throw new Error(error)
    }
}

const createNew = async (data) => {
    try {
        console.log('data insert', data);
        const validDataBeforeCreate = await validData(data)
        const createBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validDataBeforeCreate)
        return createBoard
    } catch (error) {
        throw new Error(error)
    }
}
const findOneById = async (id) => {
    try {
        const idx = ObjectId.createFromHexString(id)
        const result = GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
            _id: idx
        })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const boardModel = {
    BOARD_COLLECTION_NAME,
    BOARD_COLLECTION_SCHEMA,
    createNew,
    findOneById
}