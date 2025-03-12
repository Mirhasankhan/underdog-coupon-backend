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
exports.userService = void 0;
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const prismaClient_1 = __importDefault(require("../../../prisma/prismaClient"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prismaClient_1.default.user.findFirst({
        where: { email: payload.email },
    });
    if (existingUser) {
        throw new ApiErrors_1.default(409, "Email already exist!");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(payload.password, 10);
    const user = yield prismaClient_1.default.user.create({
        data: Object.assign(Object.assign({}, payload), { password: hashedPassword }),
    });
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken(user, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const { password } = user, sanitizedUser = __rest(user, ["password"]);
    return {
        accessToken,
        user: sanitizedUser,
    };
});
//get single user
const getSingleUserIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prismaClient_1.default.user.findUnique({ where: { id } });
    if (!user) {
        throw new ApiErrors_1.default(404, "User not found!");
    }
    const { password } = user, sanitizedUser = __rest(user, ["password"]);
    return sanitizedUser;
});
const getUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prismaClient_1.default.user.findMany();
    if (users.length === 0) {
        throw new ApiErrors_1.default(404, "Users not found!");
    }
    const sanitizedUsers = users.map((_a) => {
        var { password } = _a, sanitizedUser = __rest(_a, ["password"]);
        return sanitizedUser;
    });
    return sanitizedUsers;
});
// const updateUserIntoDB = async (id: string, userData: any) => {
//   const existingUser = await prisma.user.findUnique({ where: { id: id } });
//   if (!existingUser) {
//     throw new ApiError(404, "No User Found to update");
//   } 
//   const updatedUser = await prisma.user.update({
//     where: { id },
//     data: userData,
//   });
//   const { password, ...sanitizedUser } = updatedUser;
//   return sanitizedUser;
// };
const updateUserIntoDB = (id, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prismaClient_1.default.user.findUnique({ where: { id } });
    if (!existingUser) {
        throw new ApiErrors_1.default(404, "No User Found to update");
    }
    const [updatedUser, notification] = yield prismaClient_1.default.$transaction([
        prismaClient_1.default.user.update({
            where: { id },
            data: userData,
        }),
        prismaClient_1.default.notification.create({
            data: {
                userId: id,
                message: "Your profile has been updated successfully.",
            },
        }),
    ]);
    const { password } = updatedUser, sanitizedUser = __rest(updatedUser, ["password"]);
    return sanitizedUser;
});
const getNotificationsFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield prismaClient_1.default.notification.findMany({ where: { userId: userId } });
    if (notifications.length === 0) {
        throw new ApiErrors_1.default(404, "No Notifications found!");
    }
    return notifications;
});
exports.userService = {
    createUserIntoDB,
    getSingleUserIntoDB,
    getUsersFromDB,
    updateUserIntoDB,
    getNotificationsFromDB
};
