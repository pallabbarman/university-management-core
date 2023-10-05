import { StudentEnrolledCourse } from '@prisma/client';
import paginationFields from 'constants/pagination';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from 'utils/catchAsync';
import pick from 'utils/pick';
import sendResponse from 'utils/sendResponse';
import { studentEnrolledCourseFilterableFields } from './constant';
import {
    editStudentEnrolledCourse,
    findAllStudentEnrolledCourses,
    findStudentEnrolledCourse,
    insertStudentEnrolledCourse,
    removeStudentEnrolledCourse,
} from './service';

export const createStudentEnrolledCourse = catchAsync(async (req: Request, res: Response) => {
    const result = await insertStudentEnrolledCourse(req.body);

    sendResponse<StudentEnrolledCourse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student Enrolled Course created successfully',
        data: result,
    });
});

export const getAllStudentEnrolledCourses = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, studentEnrolledCourseFilterableFields);
    const options = pick(req.query, paginationFields);

    const result = await findAllStudentEnrolledCourses(filters, options);

    sendResponse<StudentEnrolledCourse[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student Enrolled Courses fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});

export const getStudentEnrolledCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await findStudentEnrolledCourse(id);

    sendResponse<StudentEnrolledCourse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student Enrolled Course fetched successfully',
        data: result,
    });
});
export const updateStudentEnrolledCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await editStudentEnrolledCourse(id, req.body);

    sendResponse<StudentEnrolledCourse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student Enrolled Course updated successfully',
        data: result,
    });
});

export const deleteStudentEnrolledCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await removeStudentEnrolledCourse(id);

    sendResponse<StudentEnrolledCourse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student Enrolled Course deleted successfully',
        data: result,
    });
});
