/* eslint-disable object-curly-newline */
import { Course } from '@prisma/client';
import paginationFields from 'constants/pagination';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from 'utils/catchAsync';
import pick from 'utils/pick';
import sendResponse from 'utils/sendResponse';
import { courseFilterableFields } from './constant';
import { editCourse, findAllCourses, findCourse, insertCourse, removeCourse } from './service';

export const createCourse = catchAsync(async (req: Request, res: Response) => {
    const result = await insertCourse(req.body);

    sendResponse<Course>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course is created successfully!',
        data: result,
    });
});

export const getAllCourses = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, courseFilterableFields);
    const options = pick(req.query, paginationFields);

    const result = await findAllCourses(filters, options);

    sendResponse<Course[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Courses is retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});

export const getCourse = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await findCourse(id);

    sendResponse<Course>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course is retrieved successfully!',
        data: result,
    });
});

export const updateCourse = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await editCourse(id, req.body);

    sendResponse<Course>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course is updated successfully!',
        data: result,
    });
});

export const deleteCourse = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await removeCourse(id);

    sendResponse<Course>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course deleted successfully!',
        data: result,
    });
});
