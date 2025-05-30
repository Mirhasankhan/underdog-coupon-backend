import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
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
  };

export default validateRequest;

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
