import { StudentEnrolledCourseMark } from '@prisma/client';
import paginationFields from 'constants/pagination';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from 'utils/catchAsync';
import pick from 'utils/pick';
import sendResponse from 'utils/sendResponse';
import { studentEnrolledCourseMarkFilterableFields } from './constant';
import {
    editFinalMarks,
    editStudentMarks,
    findAllStudentEnrolledCourseMarks,
    findMyCourseMarks,
} from './service';

export const getAllStudentEnrolledCourseMarks = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, studentEnrolledCourseMarkFilterableFields);
    const options = pick(req.query, paginationFields);

    const result = await findAllStudentEnrolledCourseMarks(filters, options);

    sendResponse<StudentEnrolledCourseMark[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student course marks fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});

export const updateStudentMarks = catchAsync(async (req: Request, res: Response) => {
    const result = await editStudentMarks(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Marks updated!',
        data: result,
    });
});

export const updateFinalMarks = catchAsync(async (req: Request, res: Response) => {
    const result = await editFinalMarks(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Final marks updated!',
        data: result,
    });
});

export const getMyCourseMarks = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, studentEnrolledCourseMarkFilterableFields);
    const options = pick(req.query, paginationFields);
    const { user } = req;

    const result = await findMyCourseMarks(filters, options, user);

    sendResponse<StudentEnrolledCourseMark[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student course marks fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});
