import { OfferedCourseClassSchedule } from '@prisma/client';
import paginationFields from 'constants/pagination';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from 'utils/catchAsync';
import pick from 'utils/pick';
import sendResponse from 'utils/sendResponse';
import { offeredCourseClassScheduleFilterableFields } from './constant';
import {
    editOfferedCourseClassSchedule,
    findAllOfferedCourseClassSchedules,
    findOfferedCourseClassSchedule,
    insertOfferedCourseClassSchedule,
    removeOfferedCourseClassSchedule,
} from './service';

export const createOfferedCourseClassSchedule = catchAsync(async (req: Request, res: Response) => {
    const result = await insertOfferedCourseClassSchedule(req.body);

    sendResponse<OfferedCourseClassSchedule>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered course class schedule created successfully!',
        data: result,
    });
});

export const getAllOfferedCourseClassSchedules = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, offeredCourseClassScheduleFilterableFields);
    const options = pick(req.query, paginationFields);

    const result = await findAllOfferedCourseClassSchedules(filters, options);

    sendResponse<OfferedCourseClassSchedule[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered course class schedules is retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});

export const getOfferedCourseClassSchedule = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;

    const result = await findOfferedCourseClassSchedule(id);

    sendResponse<OfferedCourseClassSchedule>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered course class schedule is retrieved successfully!',
        data: result,
    });
});

export const updateOfferedCourseClassSchedule = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;

    const result = await editOfferedCourseClassSchedule(id, req.body);

    sendResponse<OfferedCourseClassSchedule>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered course class schedule updated successfully!',
        data: result,
    });
});

export const deleteOfferedCourseClassSchedule = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;

    const result = await removeOfferedCourseClassSchedule(id);

    sendResponse<OfferedCourseClassSchedule>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered course class schedule deleted successfully!',
        data: result,
    });
});
