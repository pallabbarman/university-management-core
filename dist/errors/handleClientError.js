"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleClientError = (error) => {
    let errors = [];
    let message = '';
    const statusCode = http_status_1.default.BAD_REQUEST;
    if (error.code === 'P2025') {
        message = error.meta?.cause || 'Record not found!';
        errors = [
            {
                path: '',
                message,
            },
        ];
    }
    else if (error.code === 'P2003') {
        if (error.message.includes('delete()` invocation:')) {
            message = 'Delete failed';
            errors = [
                {
                    path: '',
                    message,
                },
            ];
        }
    }
    return {
        statusCode,
        message,
        errorMessage: errors,
    };
};
exports.default = handleClientError;
