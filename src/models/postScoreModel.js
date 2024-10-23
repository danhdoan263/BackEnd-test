import Joi from 'joi'
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

const POST_COLLECTION_NAME = 'postScore';
const POST_COLLECTION_SCHEMA = Joi.object({
    post_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    userList: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)),
});

//get PostScore
const checkPostwithPostId = async (post_id) => {
    return await GET_DB().collection(POST_COLLECTION_NAME).findOne({ post_id: post_id })
}

//add user if user_id not in this userList
const addUserToUserList = async (post_id, userLike_id) => {
    return await GET_DB().collection(POST_COLLECTION_NAME).updateOne(
        { post_id: post_id },
        { $push: { userList: userLike_id } }
    )
}

//remove user if user_id in this userList
const removeUserFromUserList = async (post_id, userLike_id) => {
    return await GET_DB().collection(POST_COLLECTION_NAME).updateOne(
        { post_id: post_id },
        { $pull: { userList: userLike_id } }
    )
}

const createNew = async (post_id, userLike_id) => {

    try {
        const postScore = await checkPostwithPostId(post_id)
        if (!postScore) {
            const newPostScore = {
                post_id: post_id,
                userList: [userLike_id]
            }
            const validPostScore = await POST_COLLECTION_SCHEMA.validateAsync(newPostScore)
            return await GET_DB().collection(POST_COLLECTION_NAME).insertOne(validPostScore)
        }
        else {
            const isUserInThisSchema = postScore.userList.includes(userLike_id)
            if (!isUserInThisSchema) {
                return await addUserToUserList(post_id, userLike_id)
            }
            else {
                return await removeUserFromUserList(post_id, userLike_id)
            }
        }

    } catch (error) {
        throw new Error(error)
    }
}


export const postScoreModel = {
    createNew,
    checkPostwithPostId
}

// checkPostwithPostId have 2 function, 1 is support for check in create new, and get post_id to count all like

//author: danh doan work for all project