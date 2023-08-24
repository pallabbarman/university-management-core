"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBuildingValidation = exports.buildingValidation = void 0;
const zod_1 = __importDefault(require("zod"));
exports.buildingValidation = zod_1.default.object({
    body: zod_1.default.object({
        title: zod_1.default.string({
            required_error: 'Title is required!',
        }),
    }),
});
exports.updateBuildingValidation = zod_1.default.object({
    body: zod_1.default.object({
        title: zod_1.default.string().optional(),
    }),
});
