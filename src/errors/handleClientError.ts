import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { IGenericErrorMessage, IGenericErrorResponse } from 'types/errors';

const handleClientError = (error: Prisma.PrismaClientKnownRequestError): IGenericErrorResponse => {
    let errors: IGenericErrorMessage[] = [];
    let message = '';
    const statusCode = httpStatus.BAD_REQUEST;

    if (error.code === 'P2025') {
        message = (error.meta?.cause as string) || 'Record not found!';
        errors = [
            {
                path: '',
                message,
            },
        ];
    } else if (error.code === 'P2003') {
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

export default handleClientError;
