import { Semester } from '@prisma/client';
import paginationFields from 'constants/pagination';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from 'utils/catchAsync';
import pick from 'utils/pick';
import sendResponse from 'utils/sendResponse';
import { semesterFilterableFields } from './constant';
import { findAllSemesters, findSemester, insertSemester } from './service';

export const createSemester = catchAsync(async (req: Request, res: Response) => {
    const result = await insertSemester(req.body);

    sendResponse<Semester>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Semester is created successfully!',
        data: result,
    });
});

export const getAllSemesters = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, semesterFilterableFields);
    const options = pick(req.query, paginationFields);
    const result = await findAllSemesters(filters, options);

    sendResponse<Semester[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Semesters is retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});

export const getSemester = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await findSemester(id);

    sendResponse<Semester>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Semester is retrieved successfully!',
        data: result,
    });
});
