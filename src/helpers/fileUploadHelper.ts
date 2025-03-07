import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import * as fs from "fs";
import config from "../config";
import { ICloudinaryResponsee, IUploadFile } from "../app/interfaces/file";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/mov",
      "video/avi",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images and videos are allowed."));
    }
  },
});

const uploadToCloudinary = async (
  files: IUploadFile[]
): Promise<ICloudinaryResponsee[]> => {
  const uploadPromises = files.map((file) => {
    return new Promise<ICloudinaryResponsee>((resolve, reject) => {
      cloudinary.uploader.upload(
        file.path,
        {
          resource_type: file.mimetype.startsWith("video") ? "video" : "image",
        },
        (error: any, result: any) => {
          fs.unlinkSync(file.path);
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
  return Promise.all(uploadPromises);
};

export const FileUploadHelper = {
  uploadToCloudinary,
  upload,
};
