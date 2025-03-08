"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomCode = void 0;
const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }
    return code;
};
exports.generateRandomCode = generateRandomCode;
