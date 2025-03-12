"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
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
            return cb(new Error("File type not allowed"), false);
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
exports.fileUploader = {
    upload,
    courseImage,
    uploadMultiple,
    profileImage,
    coverPhoto,
};
