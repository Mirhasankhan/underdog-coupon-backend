"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const restaurant_validation_1 = require("./restaurant.validation");
const restaurant_controller_1 = require("./restaurant.controller");
const fileUploadHelper_1 = require("../../../helpers/fileUploadHelper");
const parseBodyData_1 = require("../../middlewares/parseBodyData");
const router = express_1.default.Router();
router.post("/create/test", 
// auth(UserRole.ADMIN),
fileUploadHelper_1.fileUploader.uploadMultiple, parseBodyData_1.parseBodyData, 
// validateRequest(restaurantValidation.restaurantValidationSchema),
restaurant_controller_1.restaurantController.createRestaurant);
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), restaurant_controller_1.restaurantController.getRestaurants);
router.delete("/delete/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), restaurant_controller_1.restaurantController.deleteRestarant);
router.put("/update/:id", (0, validateRequest_1.default)(restaurant_validation_1.restaurantValidation.updateRestaurantValidationSchema), restaurant_controller_1.restaurantController.updateRestaurant);
exports.restaurantRoutes = router;
