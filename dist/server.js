"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./utils/logger");
const app_1 = __importDefault(require("./app"));
const configs_1 = __importDefault(require("./configs"));
const startServer = async () => {
    const server = app_1.default.listen(configs_1.default.port, () => {
        logger_1.logger.info(`Server running on port ${configs_1.default.port || 5002}`);
    });
    const exitHandler = () => {
        if (server) {
            server.close(() => {
                logger_1.logger.info('Server closed');
            });
        }
        process.exit(1);
    };
    const unexpectedErrorHandler = (error) => {
        logger_1.errorLogger.error(error);
        exitHandler();
    };
    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);
    process.on('SIGTERM', () => {
        logger_1.logger.info('SIGTERM is received');
        if (server) {
            server.close();
        }
    });
};
startServer();
