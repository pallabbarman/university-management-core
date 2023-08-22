/* eslint-disable object-curly-newline */
import paginationFields from 'constants/pagination';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from 'utils/catchAsync';
import pick from 'utils/pick';
import sendResponse from 'utils/sendResponse';
import { studentFilterableFields } from './constant';
import { editStudent, findAllStudents, findStudent, insertStudent, removeStudent } from './service';

export const createStudent = catchAsync(async (req: Request, res: Response) => {
    const result = await insertStudent(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student created successfully!',
        data: result,
    });
});

export const getAllStudents = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, studentFilterableFields);
    const options = pick(req.query, paginationFields);

    const result = await findAllStudents(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Students is retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});

export const getStudent = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await findStudent(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is retrieved successfully!',
        data: result,
    });
});

export const updateStudent = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await editStudent(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is updated successfully!',
        data: result,
    });
});

export const deleteStudent = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await removeStudent(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is deleted successfully!',
        data: result,
    });
});
