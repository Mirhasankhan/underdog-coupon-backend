import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 3000 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/x-matroska",
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("File type not allowed") as unknown as null, false);
    }
    cb(null, true);
  },
});

// upload single image
const courseImage = upload.single("courseImage");
const profileImage = upload.single("profileImage");
const coverPhoto = upload.single("coverPhoto");

// upload multiple image
const uploadMultiple = upload.fields([
  { name: "imageUrl", maxCount: 1 },
  { name: "videoUrl", maxCount: 1 },
]);

export const fileUploader = {
  upload,
  courseImage,
  uploadMultiple,
  profileImage,
  coverPhoto,
};
