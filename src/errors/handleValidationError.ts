/* eslint-disable comma-dangle */
import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { IGenericErrorResponse } from 'types/errors';

const handleValidationError = (
    error: Prisma.PrismaClientValidationError
): IGenericErrorResponse => {
    const errors = [
        {
            path: '',
            message: error.message,
        },
    ];

    const statusCode = httpStatus.BAD_REQUEST;

    return {
        statusCode,
        message: 'Validation Error',
        errorMessage: errors,
    };
};

export default handleValidationError;
