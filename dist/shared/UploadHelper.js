"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadInSpace = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const path_1 = __importDefault(require("path"));
const DO_CONFIG = {
    endpoint: "https://nyc3.digitaloceanspaces.com",
    region: "nyc3",
    credentials: {
        accessKeyId: "DO002RGDJ947DJHJ9WDT",
        secretAccessKey: "e5+/pko6Ojar51Hb8ojUKfq2HtXy+tnGKOfs3rIcEfo",
    },
    spaceName: "smtech-space",
};
const s3Config = {
    endpoint: DO_CONFIG.endpoint,
    region: DO_CONFIG.region,
    credentials: DO_CONFIG.credentials,
    forcePathStyle: true,
};
const s3 = new client_s3_1.S3Client(s3Config);
const MAX_FILE_SIZE = 3000 * 1024 * 1024;
// Allowed MIME types
const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/webp",
    "video/mpeg",
    "video/mp4",
    "video/x-matroska",
    "audio/mpeg",
    "application/zip",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
/**
 * Uploads a file buffer to DigitalOcean Spaces and returns the file URL.
 * @param {Express.Multer.File} file - The file object from multer
 * @returns {Promise<string>} - The URL of the uploaded file
 * @throws {Error} - If file validation fails or upload fails
 */
const uploadInSpace = (file, folder) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!file) {
            throw new Error("No file provided");
        }
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
        }
        // Validate file type
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new Error("File type not allowed");
        }
        // Generate a unique filename with original extension
        const fileExtension = path_1.default.extname(file.originalname);
        const fileName = `uploads/${folder}/${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 15)}${fileExtension}`;
        const uploadParams = {
            Bucket: DO_CONFIG.spaceName,
            Key: fileName,
            Body: file.buffer,
            ACL: "public-read",
            ContentType: file.mimetype,
        };
        const upload = new lib_storage_1.Upload({
            client: s3,
            params: uploadParams,
        });
        yield upload.done();
        const fileUrl = `${DO_CONFIG.endpoint}/${DO_CONFIG.spaceName}/${fileName}`;
        return fileUrl;
    }
    catch (error) {
        // console.error("Error uploading file to DigitalOcean Spaces:", error);
        throw new Error(error instanceof Error
            ? `Failed to upload file: ${error.message}`
            : "Failed to upload file to DigitalOcean Spaces");
    }
});
exports.uploadInSpace = uploadInSpace;
