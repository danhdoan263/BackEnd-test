import { avatarService } from '~/services/avatarService';
import { StatusCodes } from 'http-status-codes';
import multer from 'multer';
import { postService } from '~/services/postService';

const UPLOAD_FOLDER = 'D:/uploads';

// Config local destination for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Middleware to check if the file was uploaded and return its URL
const uploadFileChecker = async (req, res, next, action = 'general') => {
  if (!req.file) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'No file uploaded',
    });
  }

  // Generate the file URL
  const fileURL = `${req.protocol}://${req.get('host')}/uploads/${
    req.file.filename
  }`;

  req.fileLink = fileURL;

  // Respond to the user with the file URL
  res.status(StatusCodes.OK).json({
    message: `${action} uploaded successfully`,
    filePath: fileURL,
  });

  next();
};

// Service to handle avatar upload demo
// const setAvatarService = async (req, res) => {
//     const userId = req.user;
//     await uploadService.createNew(userId, req.avatarLink);
// };

const setFileService = async (req, res, action) => {
  const userId = req.user;
  const fileLink = req.fileLink;
  console.log(fileLink);

  let caption = null;
  if (req.body.caption) {
    caption = req.body.caption;
  }

  switch (action) {
    case 'avatar':
      await avatarService.createNew(userId, fileLink);
      break;

    case 'post':
      await postService.createNew(userId, fileLink, caption);
      break;

    default:
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'resquest invalid',
      });
  }
};

// Function to handle single file upload with multer
const uploadSingle = (key) => {
  return upload.single(key);
};

// Main function to handle the full upload and avatar service process
const uploadManifest = (req, res, next, action) => {
  uploadFileChecker(req, res, next, action);
  setFileService(req, res, action);
};

// Exporting the upload controller
export const uploadController = {
  uploadSingle,
  uploadFileChecker,
  setFileService,
  uploadManifest,
};
