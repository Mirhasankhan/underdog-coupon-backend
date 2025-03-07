"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const cors_1 = __importDefault(require("cors"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./app/routes"));
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
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "..", "uploads")));
// Route handler for root endpoint
app.get("/", (req, res) => {
    res.send({
        Message: "Welcome to api main route",
    });
});
// Router setup
app.use("/api/v1", routes_1.default);
// Global Error Handler
app.use(globalErrorHandler_1.default);
// API Not found handler
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
