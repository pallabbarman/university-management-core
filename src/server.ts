import { Server } from 'http';
import { errorLogger, logger } from 'utils/logger';
import app from './app';
import envConfig from './configs';

const startServer = async () => {
    const server: Server = app.listen(envConfig.port, () => {
        logger.info(`Server running on port ${envConfig.port || 5002}`);
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

    process.on('SIGTERM', () => {
        logger.info('SIGTERM is received');
        if (server) {
            server.close();
        }
    });
};

startServer();
