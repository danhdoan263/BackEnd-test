import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { uploadController } from '~/controllers/uploadController'
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

Router.route('/login')
    .post(userController.login)

Router.route('/register')
    .get()
    .post(userValidation.createNew, userController.createNew)


//get details user
Router.route('/getDetails')
    .get(authTokenMiddleware)

//upload avatar for user
Router.route('/uploads')
    .post(authTokenMiddleware, uploadController.uploadSingle('photo'), (req, res, next) => {
        const action = 'avatar'
        uploadController.uploadManifest(req, res, next, action)
    })

export const userRoute = Router