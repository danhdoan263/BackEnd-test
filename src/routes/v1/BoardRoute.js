import express from 'express';
import { StatusCodes } from "http-status-codes";

const Router = express.Router()

Router.route('/')
    .get((req, res) => {
        res.status(StatusCodes.ACCEPTED).json({
            message: 'route / accepted',
            code: StatusCodes.ACCEPTED
        })
    })
    .post()

export const boardRouter = Router