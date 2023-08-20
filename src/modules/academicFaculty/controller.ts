/* eslint-disable import/prefer-default-export */
import { AcademicFaculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from 'utils/catchAsync';
import sendResponse from 'utils/sendResponse';
import { insertAcademicFaculty } from './service';

export const createAcademicFaculty = catchAsync(async (req: Request, res: Response) => {
    const result = await insertAcademicFaculty(req.body);

    sendResponse<AcademicFaculty>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Faculty is created successfully!',
        data: result,
    });
});
