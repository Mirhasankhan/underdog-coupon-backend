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
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const cors_1 = __importDefault(require("cors"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const client_1 = require("@prisma/client");
const routes_1 = __importDefault(require("./app/routes"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
// Middleware setup
prisma
    .$connect()
    .then(() => {
    console.log("Database connected successfully!");
})
    .catch((error) => {
    console.error("Failed to connect to the database:", error);
});
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "https://underdog-coupons-dashboard.vercel.app",
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
// Route handler for root endpoint
app.get("/", (req, res) => {
    res.send({
        Message: "Welcome to api main route",
    });
});
// app.get("/quranAudio", async (req: Request, res: Response) => {
//   try {
//     // Fetch data from external Quran audio API
//     const response = await axios.get(
//       "http://api.alquran.cloud/v1/quran/ar.alafasy"    );
//     const audioData = response.data;
//     res.send({
//       message: "Welcome to API main route",
//       audioData: audioData.data.surahs,
//     });
//   } catch (error) {
//     res.status(500).send({
//       message: "Error fetching Quran audio",
//       error: "something went wrong",
//     });
//   }
// });
// Router setup
app.use("/api/v1", routes_1.default);
app.get("/quranAudio", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get("http://api.alquran.cloud/v1/quran/ar.alafasy");
        const surahs = response.data.data.surahs;
        const processedSurahs = surahs.map((surah) => {
            return {
                surah_number: surah.number,
                surah_name: surah.name,
                ayahs: surah.ayahs.map((ayah) => {
                    return {
                        ayah_number: ayah.number,
                        audio_link: ayah.audio,
                    };
                }),
            };
        });
        res.send({
            audioData: processedSurahs,
        });
    }
    catch (error) {
        res.status(500).send({
            message: "Error fetching Quran audio",
            error: "something went wrong",
        });
    }
}));
// Global Error Handler
app.use(globalErrorHandler_1.default);
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!",
        },
    });
});
exports.default = app;
