import { userModel } from "~/models/usersModel"

const createNew = async (userId, UrlPath) => {
    console.log('log from upload service');
    console.log(userId, UrlPath);
    const response = await userModel.setAvatar(userId, UrlPath)


    return response
}


export const uploadService = {
    createNew
}