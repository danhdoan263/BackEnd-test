import { StatusCodes } from "http-status-codes"
import { postService } from "~/services/postService"


const getPost = async (req, res, next) => {
    const getPost = await postService.getPost()
    if (getPost) {
        res.status(StatusCodes.OK).json({
            message: 'query accept',
            data: getPost
        })
    }
}



export const postController = {
    getPost
}