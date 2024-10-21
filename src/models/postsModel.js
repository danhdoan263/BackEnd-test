const Joi = require("joi");
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const POST_COLLECTION_NAME = 'posts';
const POST_COLLECTION_SCHEMA = Joi.object({
    post_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    user_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    image_url: Joi.string().uri().required().max(255).trim().strict(),
    caption: Joi.string().trim().strict(),
    created_at: Joi.date().timestamp('javascript').default(Date.now)
});

const validData = async (data) => {
    return await POST_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (userId, fileLink, caption) => {
    try {

        const data = {
            user_id: userId,
            image_url: fileLink,
            caption: caption
        }

        const validateData = await validData(data)

        return await GET_DB().collection(POST_COLLECTION_NAME).insertOne(validateData)

    } catch (error) {
        throw new Error(error)
    }
}

const getPost = async () => {
    try {
        return await GET_DB().collection(POST_COLLECTION_NAME).find({}).toArray();
    } catch (error) {
        throw new Error(error)
    }
}


export const postsModel = {
    createNew,
    getPost
}