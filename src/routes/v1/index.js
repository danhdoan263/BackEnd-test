// quản lí router
import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardRouter } from "~/routes/v1/BoardRoute";
import { userRoute } from "~/routes/v1/userRouter";


const Router = express.Router()
Router.use('/board', boardRouter)

Router.get('/', (req, res) => {
    res.end('<h1>API v1 ready to use!</h1>')
})
// main

Router.use('/user', userRoute)

export const API_v1 = Router