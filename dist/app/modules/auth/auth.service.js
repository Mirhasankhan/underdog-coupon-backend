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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const generateOtp_1 = __importDefault(require("../../../helpers/generateOtp"));
const sendEmail_1 = __importDefault(require("../../../helpers/sendEmail"));
//login user
const loginUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (!user) {
        throw new ApiErrors_1.default(404, "User not found");
    }
    const isPasswordValid = yield bcryptjs_1.default.compare(payload.password, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordValid) {
        throw new ApiErrors_1.default(401, "Invalid credentials");
    }
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken(user, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const { password, createdAt, updatedAt } = user, userInfo = __rest(user, ["password", "createdAt", "updatedAt"]);
    return {
        accessToken,
        userInfo,
        password,
    };
});
const googleLoginIntoDB = (userName, email) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield prisma_1.default.user.findUnique({
        where: {
            email: email,
        },
    });
    if (!user) {
        user = yield prisma_1.default.user.create({
            data: {
                userName: userName,
                email: email,
                password: "12Ab565@",
            },
        });
    }
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken(user, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return { accessToken, user };
});
//send forgot password otp
const sendForgotPasswordOtpDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const existringUser = yield prisma_1.default.user.findUnique({
        where: {
            email: email,
        },
    });
    if (!existringUser) {
        throw new ApiErrors_1.default(404, "User not found");
    }
    // Generate OTP and expiry time
    const otp = (0, generateOtp_1.default)(); // 4-digit OTP
    const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minute
    const expiresAt = Date.now() + OTP_EXPIRATION_TIME;
    const subject = "Your Password Reset OTP";
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>Password Reset Request</h2>
    <p>Hi <b>${existringUser.userName}</b>,</p>
    <p>Your OTP for password reset is:</p>
    <h1 style="color: #007BFF;">${otp}</h1>
    <p>This OTP is valid for <b>5 minutes</b>. If you did not request this, please ignore this email.</p>
    <p>Thanks, <br>The Support Team</p>
  </div>
`;
    yield (0, sendEmail_1.default)(email, subject, html);
    yield prisma_1.default.otp.upsert({
        where: {
            email: email,
        },
        update: { otpCode: otp, expiresAt: new Date(expiresAt) },
        create: { email: email, otpCode: otp, expiresAt: new Date(expiresAt) },
    });
    return otp;
});
// const changePasswordFromDB = async (
//   userId: string,
//   newPassword: string,
//   oldPassword: string
// ) => {
//   const existingUser = await prisma.user.findUnique({
//     where: { id: userId },
//   });
//   if (!existingUser || !(await bcrypt.compare(oldPassword, existingUser.password))) {
//     throw new Error("Invalid email or password");
//   }
//   const hashedPassword = await bcrypt.hash(
//     newPassword,
//     Number(config.jwt.gen_salt)
//   );
//   const result = await prisma.user.update({
//     where: {
//       id: userId,
//     },
//     data: {
//       password: hashedPassword,
//     },
//   });
//   const { password, ...userInfo } = result;
//   return userInfo;
// };
// verify otp code
const changePasswordFromDB = (userId, newPassword, oldPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!existingUser ||
        !(yield bcryptjs_1.default.compare(oldPassword, existingUser.password))) {
        throw new Error("Invalid old password");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, Number(config_1.default.jwt.gen_salt));
    const [updatedUser, notification] = yield prisma_1.default.$transaction([
        prisma_1.default.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        }),
        prisma_1.default.notification.create({
            data: {
                userId: userId,
                message: "Your password has been changed successfully.",
            },
        }),
    ]);
    const { password } = updatedUser, userInfo = __rest(updatedUser, ["password"]);
    return userInfo;
});
const verifyForgotPasswordOtpCodeDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = payload;
    if (!email && !otp) {
        throw new ApiErrors_1.default(400, "Email and OTP are required.");
    }
    const user = yield prisma_1.default.user.findUnique({ where: { email: email } });
    if (!user) {
        throw new ApiErrors_1.default(404, "User not found");
    }
    const userId = user.id;
    const verifyData = yield prisma_1.default.otp.findUnique({
        where: {
            email: email,
        },
    });
    if (!verifyData) {
        throw new ApiErrors_1.default(400, "Invalid or expired OTP.");
    }
    const { otpCode: savedOtp, expiresAt } = verifyData;
    if (otp !== savedOtp) {
        throw new ApiErrors_1.default(401, "Invalid OTP.");
    }
    if (Date.now() > expiresAt.getTime()) {
        yield prisma_1.default.otp.delete({
            where: {
                email: email,
            },
        }); // OTP has expired
        throw new ApiErrors_1.default(410, "OTP has expired. Please request a new OTP.");
    }
    // OTP is valid
    yield prisma_1.default.otp.delete({
        where: {
            email: email,
        },
    });
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({ id: userId, email }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return { accessToken: accessToken };
});
// reset password
const resetForgotPasswordDB = (newPassword, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
        throw new ApiErrors_1.default(404, "user not found");
    }
    const email = existingUser.email;
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, Number(config_1.default.jwt.gen_salt));
    const result = yield prisma_1.default.user.update({
        where: {
            email: email,
        },
        data: {
            password: hashedPassword,
        },
    });
    const { password } = result, userInfo = __rest(result, ["password"]);
    return userInfo;
});
exports.authService = {
    loginUserIntoDB,
    sendForgotPasswordOtpDB,
    verifyForgotPasswordOtpCodeDB,
    resetForgotPasswordDB,
    changePasswordFromDB,
    googleLoginIntoDB,
};
