import { ObjectId } from "mongodb"

const Joi = require("joi")
const { GET_DB } = require("~/config/mongodb")
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require("~/utils/validators")

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
    user_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    username: Joi.string().required().min(3).max(50).trim().strict(),
    email: Joi.string().required().min(3).max(254).trim().strict(),
    password: Joi.string().required().min(3).trim().strict(),
    full_name: Joi.string().required().min(3).max(100).trim().strict(),
    bio: Joi.string().trim().strict(),
    profile_url_img: Joi.string().trim().strict(),
    created_at: Joi.date().timestamp('javascript').default(Date.now),
    destroy_at: Joi.date().timestamp('javascript').default(Date.now)
})

const validData = async (data) => {
    return await USER_COLLECTION_SCHEMA.validateAsync(data, ({ abortEarly: false }))
}


//validate and created success
const createNew = async (reqBody) => {
    try {
        const validDataBeforeCreate = await validData(reqBody)
        const createdUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validDataBeforeCreate)
        return createdUser
    } catch (error) {
        throw new Error(error)
    }
}
//find username
const findUsername = async (username) => {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ username })
}

const setAvatar = async (userId, UrlPath) => {
    const idx = new ObjectId(userId)
    return await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
        { _id: idx },
        {
            $set: {
                profile_url_img: UrlPath
            }
        }
    )
}

export const userModel = {
    createNew,
    findUsername,
    setAvatar
}