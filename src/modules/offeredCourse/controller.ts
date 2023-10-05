import { OfferedCourse } from '@prisma/client';
import paginationFields from 'constants/pagination';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from 'utils/catchAsync';
import pick from 'utils/pick';
import sendResponse from 'utils/sendResponse';
import { offeredCourseFilterableFields } from './constant';
import {
    editOfferedCourse,
    findAllOfferedCourses,
    findOfferedCourse,
    insertOfferedCourse,
    removeOfferedCourse,
} from './service';

export const createOfferedCourses = catchAsync(async (req: Request, res: Response) => {
    const result = await insertOfferedCourse(req.body);

    sendResponse<OfferedCourse[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered Courses created successfully!',
        data: result,
    });
});

export const getAllOfferedCourses = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, offeredCourseFilterableFields);
    const options = pick(req.query, paginationFields);

    const result = await findAllOfferedCourses(filters, options);

    sendResponse<OfferedCourse[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered Courses is retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});

export const getOfferedCourse = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await findOfferedCourse(id);

    sendResponse<OfferedCourse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered Course is retrieved successfully!',
        data: result,
    });
});

export const updateOfferedCourse = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await editOfferedCourse(id, req.body);

    sendResponse<OfferedCourse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered Course updated successfully!',
        data: result,
    });
});

export const deleteOfferedCourse = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await removeOfferedCourse(id);

    sendResponse<OfferedCourse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered Course deleted successfully!',
        data: result,
    });
});
