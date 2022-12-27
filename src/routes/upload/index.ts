import { Router } from 'express';
// import { getUser } from '@/utils';
import { authenticationGate } from '@/middleware/auth';

// const sharp = require('sharp');
import multer from 'multer'

import fs  from 'fs';
import { generateId } from '@/utils/randomUtils';
import { uploadFileRouter } from './upload-file';

const router = Router();

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    // dynamic folder
    const {  track }  = req.body
    const path = 'uploads/'+ (track || 'images')
    fs.mkdirSync(path, { recursive: true })
    cb(null, path);
  },
  filename: function (req: any, file: any, cb: any) {
    const typeFile = file.originalname.split('.');
    cb(null, generateId() + Date.now() + '.' + typeFile.pop());
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Image uploaded is not of type jpg/jpegor png'), false);
  }
};

const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024, // 1MB
  },
  fileFilter: fileFilter,
});

router.post(
  '/upload/image',
  authenticationGate,
  uploadImage.single('image'),
  async (req: any, res: any) => {
    // check token here

    // const user = await getUser({ userId });
    // get user id
    // const { userId } = req.auth as RequestAuth;

    // remove old image
    if (req.body.oldImage) {
      fs.unlinkSync(`uploads/${req.body.oldImage}`);
    }

    // not image file
    if (!req.file) {
      return res.send('Not Image', 400);
    }

    // resize image
    // sharp(req.file.path)
    //   .resize({ height: 300, width: 300 })
    //   .toFile(req.file.path)
    //   .then(function (newFileInfo:any) {
    //     console.log(newFileInfo);
    //     console.log('Success');
    //   })
    //   .catch(function (err:any) {
    //     console.log('Error occured'+ err.toString());
    //   });

    res.send({
      file: req.file,
    });
  }
);
router.use(uploadFileRouter)
const uploadRouter = router;
export { uploadRouter };
