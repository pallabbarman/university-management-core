import { Server } from 'http';
import { errorLogger, logger } from 'utils/logger';
import app from './app';
import configs from './configs';

const startServer = async () => {
    const server: Server = app.listen(configs.port, () => {
        logger.info(`Server running on port ${configs.port || 5002}`);
    });

    const exitHandler = () => {
        if (server) {
            server.close(() => {
                logger.info('Server closed');
            });
        }
        process.exit(1);
    };

    const unexpectedErrorHandler = (error: unknown) => {
        errorLogger.error(error);
        exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);
};

startServer();
