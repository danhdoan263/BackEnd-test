import { userModel } from "~/models/usersModel"

const createNew = async (userId, UrlPath) => {
    const response = await userModel.setAvatar(userId, UrlPath)
    return response
}


export const avatarService = {
    createNew
}