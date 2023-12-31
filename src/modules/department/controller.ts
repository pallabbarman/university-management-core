import { Department } from '@prisma/client';
import paginationFields from 'constants/pagination';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from 'utils/catchAsync';
import pick from 'utils/pick';
import sendResponse from 'utils/sendResponse';
import { departmentFilterableFields } from './constant';
import {
    editDepartment,
    findAllDepartments,
    findDepartment,
    insertDepartment,
    removeDepartment,
} from './service';

export const createDepartment = catchAsync(async (req: Request, res: Response) => {
    const result = await insertDepartment(req.body);

    sendResponse<Department>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Department is created successfully!',
        data: result,
    });
});

export const getAllDepartments = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, departmentFilterableFields);
    const options = pick(req.query, paginationFields);

    const result = await findAllDepartments(filters, options);

    sendResponse<Department[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Departments is retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});

export const getDepartment = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await findDepartment(id);

    sendResponse<Department>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Department is retrieved successfully!',
        data: result,
    });
});

export const updateDepartment = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await editDepartment(id, req.body);

    sendResponse<Department>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Department is updated successfully!',
        data: result,
    });
});

export const deleteDepartment = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await removeDepartment(id);

    sendResponse<Department>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Department deleted successfully!',
        data: result,
    });
});
