import { Faculty } from '@prisma/client';
import paginationFields from 'constants/pagination';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from 'utils/catchAsync';
import pick from 'utils/pick';
import sendResponse from 'utils/sendResponse';
import { facultyFilterableFields } from './constant';
import {
    editFaculty,
    findAllFaculties,
    findFaculty,
    insertFaculty,
    removeFaculty,
} from './service';

export const createFaculty = catchAsync(async (req: Request, res: Response) => {
    const result = await insertFaculty(req.body);

    sendResponse<Faculty>(res, {
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

    sendResponse<Faculty[]>(res, {
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

    sendResponse<Faculty>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty is retrieved successfully!',
        data: result,
    });
});

export const updateFaculty = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await editFaculty(id, req.body);

    sendResponse<Faculty>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty is updated successfully!',
        data: result,
    });
});

export const deleteFaculty = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await removeFaculty(id);

    sendResponse<Faculty>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty deleted successfully!',
        data: result,
    });
});
