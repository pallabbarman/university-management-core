import { OfferedCourseSection } from '@prisma/client';
import paginationFields from 'constants/pagination';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from 'utils/catchAsync';
import pick from 'utils/pick';
import sendResponse from 'utils/sendResponse';
import { offeredCourseSectionFilterableFields } from './constant';
import {
    editOfferedCourseSection,
    findAllOfferedCourseSections,
    findOfferedCourseSection,
    insertOfferedCourseSection,
    removeOfferedCourseSection,
} from './service';

export const createOfferedCourseSection = catchAsync(async (req: Request, res: Response) => {
    const result = await insertOfferedCourseSection(req.body);

    sendResponse<OfferedCourseSection>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered course section is created successfully!',
        data: result,
    });
});

export const getAllOfferedCourseSections = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, offeredCourseSectionFilterableFields);
    const options = pick(req.query, paginationFields);

    const result = await findAllOfferedCourseSections(filters, options);

    sendResponse<OfferedCourseSection[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered course sections is retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});

export const getOfferedCourseSection = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;

    const result = await findOfferedCourseSection(id);

    sendResponse<OfferedCourseSection>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered course section is retrieved successfully!',
        data: result,
    });
});

export const updateOfferedCourseSection = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;

    const result = await editOfferedCourseSection(id, req.body);

    sendResponse<OfferedCourseSection>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered course section updated successfully!',
        data: result,
    });
});

export const deleteOfferedCourseSection = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;

    const result = await removeOfferedCourseSection(id);

    sendResponse<OfferedCourseSection>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered course section deleted successfully!',
        data: result,
    });
});
