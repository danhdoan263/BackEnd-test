import { uploadService } from "~/services/uploadService"

import { StatusCodes } from "http-status-codes"
import multer from "multer"

const UPLOAD_FOLDER = 'D:/uploads'

//config local destination file upload to 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FOLDER)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({
    storage: storage
})
const uploadFileChecker = async (req, res, next) => {

    if (!req.file) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: 'no file uploaded'
        })
    }

    // return file url instead of filepath local
    const fileURL = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    req.avatarLink = fileURL

    //response to user is succecssfully uploaded and create static link. 
    // link are outside the project this must be config relative path in sever.js 
    // if link inside the project this will be absolute path with path join dirname
    res.status(StatusCodes.OK).json({
        message: "file uploaded successfully",
        filePath: fileURL
    })
    next();
}

const setAvatarService = async (req, res) => {
    const userId = req.user

    const response = await uploadService.createNew(userId, req.avatarLink)

}
const uploadSigle = (key) => {
    return upload.single(key)
}
const uploadMainfest = (req, res, next) => {
    uploadFileChecker(req, res, next)

    setAvatarService(req, res)
}
export const uploadController = {
    uploadSigle,
    uploadFileChecker,
    setAvatarService,
    uploadMainfest
}