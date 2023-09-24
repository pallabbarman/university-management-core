import { CourseFaculty, Faculty, Student } from '@prisma/client';
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
    findMyCourseStudents,
    findMyCourses,
    insertFaculty,
    removeCourses,
    removeFaculty,
    setCourses,
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

export const assignCourses = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await setCourses(id, req.body?.courses);

    sendResponse<CourseFaculty[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course faculty assigned successfully!',
        data: result,
    });
});

export const deleteCourses = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await removeCourses(id, req.body?.courses);

    sendResponse<CourseFaculty[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course faculty deleted successfully!',
        data: result,
    });
});

export const myCourses = catchAsync(async (req: Request, res: Response) => {
    const { user } = req;
    const filter = pick(req.query, ['academicSemesterId', 'courseId']);

    const result = await findMyCourses(user, filter);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My courses data fetched successfully!',
        data: result,
    });
});

export const getMyCourseStudents = catchAsync(async (req: Request, res: Response) => {
    const { user } = req;
    const filters = pick(req.query, ['academicSemesterId', 'courseId', 'offeredCourseSectionId']);
    const options = pick(req.query, paginationFields);

    const result = await findMyCourseStudents(filters, options, user);

    sendResponse<Student[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty course students fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});
