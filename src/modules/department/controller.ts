import { Department } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from 'utils/catchAsync';
import sendResponse from 'utils/sendResponse';
import { findDepartment, insertDepartment } from './service';

export const createDepartment = catchAsync(async (req: Request, res: Response) => {
    const result = await insertDepartment(req.body);

    sendResponse<Department>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Department is created successfully!',
        data: result,
    });
});

export const getDepartment = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await findDepartment(id);

    sendResponse<Department>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Department is retrieved successfully!',
        data: result,
    });
});
