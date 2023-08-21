import paginationFields from 'constants/pagination';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from 'utils/catchAsync';
import pick from 'utils/pick';
import sendResponse from 'utils/sendResponse';
import { facultyFilterableFields } from './constant';
import { findAllFaculties, findFaculty, insertFaculty } from './service';

export const createFaculty = catchAsync(async (req: Request, res: Response) => {
    const result = await insertFaculty(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty created successfully!',
        data: result,
    });
});

export const getAllFaculties = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, facultyFilterableFields);
    const options = pick(req.query, paginationFields);

    const result = await findAllFaculties(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculties is retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});

export const getFaculty = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await findFaculty(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty is retrieved successfully!',
        data: result,
    });
});
