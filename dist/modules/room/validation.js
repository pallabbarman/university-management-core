"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomValidation = exports.roomValidation = void 0;
const zod_1 = __importDefault(require("zod"));
exports.roomValidation = zod_1.default.object({
    body: zod_1.default.object({
        roomNumber: zod_1.default.string({
            required_error: 'Room number is required!',
        }),
        floor: zod_1.default.string({
            required_error: 'Floor is required!',
        }),
        buildingId: zod_1.default.string({
            required_error: 'Building id is required!',
        }),
    }),
});
exports.updateRoomValidation = zod_1.default.object({
    body: zod_1.default.object({
        roomNumber: zod_1.default.string().optional(),
        floor: zod_1.default.string().optional(),
        buildingId: zod_1.default.string().optional(),
    }),
});
