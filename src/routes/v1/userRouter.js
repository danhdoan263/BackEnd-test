import express, { response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { userController } from '~/controllers/userController'
import authTokenMiddleware from '~/middlewares/authTokenMiddleware'
import { userValidation } from '~/validations/userValidation'


const Router = express.Router()


//route accepted

Router.route('/')
    .get(
        (req, res) => {
            res.status(StatusCodes.ACCEPTED).json({
                message: 'register ready to use'
            })
        }
    )
Router.route('/register')
    .get()
    .post(userValidation.createNew, userController.createNew)
Router.route('/login')
    .post(userController.login)
Router.route('/:id')
    .get(authTokenMiddleware)

export const userRoute = Router