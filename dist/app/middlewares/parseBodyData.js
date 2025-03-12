"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBodyData = void 0;
const parseBodyData = (req, res, next) => {
    if (req.body.bodyData) {
        try {
            req.body = JSON.parse(req.body.bodyData);
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: "Invalid JSON format in bodyData",
            });
            return; // Don't call next() after responding
        }
    }
    next();
};
exports.parseBodyData = parseBodyData;
