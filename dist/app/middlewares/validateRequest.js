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
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const validateRequest = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield schema.parseAsync(req.body);
        return next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: err.errors.map((error) => ({
                    path: error.path.join("."),
                    message: error.message,
                })),
            });
        }
        return next(err);
    }
});
exports.default = validateRequest;
// import { NextFunction, Request, Response } from "express";
// import { AnyZodObject, ZodEffects } from "zod";
// const validateRequest =
//   (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       if (typeof req.body.name === "string") {
//         req.body.name = JSON.parse(req.body.name);
//       }
//       await schema.parseAsync({
//         body: req.body,
//         query: req.query,
//         params: req.params,
//         cookies: req.cookies,
//       });
//       return next();
//     } catch (error) {
//       next(error);
//     }
//   };
// export default validateRequest;
