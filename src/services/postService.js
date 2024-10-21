import { postsModel } from "~/models/postsModel"

const createNew = async (userId, fileLink, caption) => {
    try {
        console.log('log from post service: ');
        console.log('userId: ', userId);
        console.log('fileLink: ', fileLink);
        console.log('fileLink: ', caption);
        console.log('===================== ');
        if (caption) {
            const createPost = await postsModel.createNew(userId, fileLink, caption)
        }
        const createPost = await postsModel.createNew(userId, fileLink)

        return createPost
    } catch (error) {
        throw new Error(error)
    }
}

const getAllPost = async () => {
    try {
        const response = await postsModel.getAllPost()
        return response
    } catch (error) {
        throw new Error('Error in postService.getAllPost: ' + error.message);
    }
}


export const postService = {
    createNew,
    getAllPost
}