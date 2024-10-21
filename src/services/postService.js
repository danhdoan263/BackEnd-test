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

const getPost = async () => {
    try {
        const response = await postsModel.getPost()
        return response
    } catch (error) {
        throw new Error(error)
    }
}


export const postService = {
    createNew,
    getPost
}