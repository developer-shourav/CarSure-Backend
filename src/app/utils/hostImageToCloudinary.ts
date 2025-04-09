import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import config from '../config';
import multer from 'multer';

// -------------Configuration values for cloudinary
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const hostImageToCloudinary = (
  imageName: string,
  imagePath: string,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    // -------------Upload an image to cloudinary
    cloudinary.uploader.upload(
      imagePath,
      {
        public_id: imageName,
      },
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result as UploadApiResponse);
        // delete a file asynchronously
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Image hosted and Local file is deleted successfully.');
          }
        });
      },
    );
  });
};

// -------------Configuration for multer for temporary storage and file management
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
