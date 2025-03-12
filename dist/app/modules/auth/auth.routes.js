"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
//login user
router.post("/login", (0, validateRequest_1.default)(auth_validation_1.authValidation.authLoginSchema), auth_controller_1.authController.loginUser);
router.post("/googleLogin", (0, validateRequest_1.default)(auth_validation_1.authValidation.authLoginSchema), auth_controller_1.authController.googleLogin);
router.post("/send-otp", auth_controller_1.authController.sendForgotPasswordOtp);
router.post("/verify-otp", auth_controller_1.authController.verifyForgotPasswordOtpCode);
router.patch("/reset-password", (0, auth_1.default)(), auth_controller_1.authController.resetPassword);
router.patch("/change-password", (0, auth_1.default)(), auth_controller_1.authController.changePassword);
exports.authRoute = router;
