/* eslint-disable import/prefer-default-export */
import { StudentSemesterPayment } from '@prisma/client';
import paginationFields from 'constants/pagination';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from 'utils/catchAsync';
import pick from 'utils/pick';
import sendResponse from 'utils/sendResponse';
import { studentSemesterPaymentFilterableFields } from './constant';
import { findAllStudentSemesterPayments } from './service';

export const getAllStudentSemesterPayments = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, studentSemesterPaymentFilterableFields);
    const options = pick(req.query, paginationFields);

    const result = await findAllStudentSemesterPayments(filters, options);

    sendResponse<StudentSemesterPayment[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student semester payment fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});
