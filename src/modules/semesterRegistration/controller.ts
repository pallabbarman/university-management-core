/* eslint-disable import/prefer-default-export */
import { SemesterRegistration } from '@prisma/client';
import paginationFields from 'constants/pagination';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from 'utils/catchAsync';
import pick from 'utils/pick';
import sendResponse from 'utils/sendResponse';
import { semesterRegistrationFilterableFields } from './constant';
import {
    beginMyRegistration,
    beginNewSemester,
    drawOutFromCourse,
    editSemesterRegistration,
    findAllSemesterRegistration,
    findMyRegistration,
    findMySemesterRegCourses,
    findSemesterRegistration,
    insertSemesterRegistration,
    joinIntoCourse,
    removeSemesterRegistration,
    verifyMyRegistration,
} from './service';

export const createSemesterRegistration = catchAsync(async (req: Request, res: Response) => {
    const result = await insertSemesterRegistration(req.body);

    sendResponse<SemesterRegistration>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Semester Registration is created successfully!',
        data: result,
    });
});

export const getAllSemesterRegistration = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, semesterRegistrationFilterableFields);
    const options = pick(req.query, paginationFields);

    const result = await findAllSemesterRegistration(filters, options);

    sendResponse<SemesterRegistration[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Semester Registrations is retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});

export const getSemesterRegistration = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;

    const result = await findSemesterRegistration(id);

    sendResponse<SemesterRegistration>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Semester Registration is retrieved successfully!',
        data: result,
    });
});

export const updateSemesterRegistration = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;

    const result = await editSemesterRegistration(id, req.body);

    sendResponse<SemesterRegistration>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Semester Registration updated successfully!',
        data: result,
    });
});

export const deleteSemesterRegistration = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;

    const result = await removeSemesterRegistration(id);

    sendResponse<SemesterRegistration>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Semester Registration deleted successfully!',
        data: result,
    });
});

export const startMyRegistration = catchAsync(async (req: Request, res: Response) => {
    const { user } = req;

    const result = await beginMyRegistration(user.userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student semester registration started successfully',
        data: result,
    });
});

export const enrollIntoCourse = catchAsync(async (req: Request, res: Response) => {
    const { user } = req;

    const result = await joinIntoCourse(user.userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student semester registration course enrolled successfully',
        data: result,
    });
});

export const withdrawFromCourse = catchAsync(async (req: Request, res: Response) => {
    const { user } = req;

    const result = await drawOutFromCourse(user.userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student Withdraw from successfully',
        data: result,
    });
});

export const confirmMyRegistration = catchAsync(async (req: Request, res: Response) => {
    const { user } = req;

    const result = await verifyMyRegistration(user.userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Confirm your registration!',
        data: result,
    });
});

export const getMyRegistration = catchAsync(async (req: Request, res: Response) => {
    const { user } = req;

    const result = await findMyRegistration(user.userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My registration data fetched!',
        data: result,
    });
});

export const startNewSemester = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await beginNewSemester(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Semester Started Successfully!',
        data: result,
    });
});

export const getMySemesterRegCourses = catchAsync(async (req: Request, res: Response) => {
    const { user } = req;

    const result = await findMySemesterRegCourses(user.userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My registration courses data fetched!',
        data: result,
    });
});
