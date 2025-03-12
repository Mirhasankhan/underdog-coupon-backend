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
exports.authController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const auth_service_1 = require("./auth.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
//login user
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.loginUserIntoDB(req.body);
    res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User successfully logged in",
        data: result,
    });
}));
const googleLogin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, userName } = req.body;
    const result = yield auth_service_1.authService.googleLoginIntoDB(userName, email);
    res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User successfully logged in",
        data: result,
    });
}));
//send forgot password otp
const sendForgotPasswordOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const response = yield auth_service_1.authService.sendForgotPasswordOtpDB(email);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "OTP send successfully",
        data: response,
    });
}));
// verify forgot password otp code
const verifyForgotPasswordOtpCode = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const response = yield auth_service_1.authService.verifyForgotPasswordOtpCodeDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "OTP verified successfully.",
        data: response,
    });
}));
// update forgot password
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { newPassword } = req.body;
    const result = yield auth_service_1.authService.resetForgotPasswordDB(newPassword, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Password updated successfully.",
        data: result,
    });
}));
// update forgot password
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { newPassword, oldPassword } = req.body;
    const result = yield auth_service_1.authService.changePasswordFromDB(userId, newPassword, oldPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Password changed successfully.",
        data: result,
    });
}));
exports.authController = {
    loginUser,
    sendForgotPasswordOtp,
    verifyForgotPasswordOtpCode,
    resetPassword,
    changePassword,
    googleLogin,
};
