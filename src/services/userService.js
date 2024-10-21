import { userModel } from "~/models/usersModel"
import jwt from 'jsonwebtoken'
import { env } from "~/config/environment"
const createNew = async (reqBody) => {
    try {
        const createNewUser = await userModel.createNew(reqBody)
        return createNewUser
    } catch (error) {
        throw new Error(error)
    }
}

// jwt login user

const login = async (username, password) => {

    try {
        const checkUser = await userModel.findUsername(username)


        if (!checkUser) {
            return {
                error: true,
                message: 'wrong username'
            }
        }
        if (checkUser.password !== password) {

            return {
                error: true,
                message: 'wrong password'
            }
        }
        const token = jwt.sign({ userId: checkUser._id }, env.SECRET_TOKEN, {
            expiresIn: '2d'
        })

        return { error: false, token, ...checkUser }
    } catch (error) {
        console.log(error);

        throw new Error(error)
    }
}
export const userService = {
    createNew,
    login
}