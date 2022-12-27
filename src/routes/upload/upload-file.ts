import { Router } from 'express';
// import { getUser } from '@/utils';
import { authenticationGate } from '@/middleware/auth';
// import { bodyValidator, Joi } from '@/validation';
// const sharp = require('sharp');
import multer from 'multer'

import fs  from 'fs';
import gql from 'graphql-tag';
import { client } from '@/utils';

const INSERT = gql`
 mutation ($object: uploads_insert_input!){
  insert_uploads_one(object:$object) {
    id
    file_name
  }
 }
`

function generateId(N = 20) {
  const s = "0123456789";
  // const s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array(N).join().split(',').map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join('')
}

const router = Router();

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    // dynamic folder
    // const {  track }  = req.body
    const date = new Date()
    const path = 'uploads/'+ date.toISOString().substring(0,10).split('-').join('/')
    fs.mkdirSync(path, { recursive: true })
    cb(null, path);
  },
  filename: function (req: any, file: any, cb: any) {
    const typeFile = file.originalname.split('.');
    cb(null, generateId() + Date.now() + '.' + typeFile.pop());
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const typeFiles = ['image/jpg','image/jpeg','image/png','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
'application/vnd.openxmlformats-officedocument.presentationml.presentation']
  if (
    typeFiles.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error('Image uploaded is not of type jpg/jpegor png'), false);
  }
};

//  const uploadSchema = Joi.object({
  // tag: Joi.required(),
  // objectId: Joi.required(),
// }).meta({ className: 'UploadSchema' });

const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 20, // 20MB
  },
  fileFilter: fileFilter,
});

router.post(
  '/upload/file',
  authenticationGate,
  uploadImage.single('file'),
  async (req: any, res: any) => {
    // check token here

    // remove old image
    // if (req.body.oldImage) {
    //   fs.unlinkSync(`uploads/${req.body.oldImage}`);
    // }

    // not image file
    if (!req.file) {
      return res.send('Not File', 400);
    }

    const path = req.file.path.toString().split('/').slice(1)

    const { originalname, filename } = req.file

    client.request(INSERT, {
      object: {
        file_name: filename,
        originalname: originalname,
        file_type: filename.split('.')[1],
        object_id: req.body.objectId,
        tag: req.body.tag,
        link: path.join('/')
      }
     }
    )

    res.send({
      file: {
        ...req.file,
        filePath: path.join('/')
      },
    });
  }
);

const uploadFileRouter = router;
export { uploadFileRouter };
