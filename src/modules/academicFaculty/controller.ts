/* eslint-disable import/prefer-default-export */
import { AcademicFaculty } from '@prisma/client';
import paginationFields from 'constants/pagination';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from 'utils/catchAsync';
import pick from 'utils/pick';
import sendResponse from 'utils/sendResponse';
import { academicFacultyFilterableFields } from './constant';
import { findAcademicFaculty, findAllAcademicFaculties, insertAcademicFaculty } from './service';

export const createAcademicFaculty = catchAsync(async (req: Request, res: Response) => {
    const result = await insertAcademicFaculty(req.body);

    sendResponse<AcademicFaculty>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Faculty is created successfully!',
        data: result,
    });
});

export const getAllAcademicFaculties = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, academicFacultyFilterableFields);
    const options = pick(req.query, paginationFields);

    const result = await findAllAcademicFaculties(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'AcademicFaculties is retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});

export const getAcademicFaculty = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await findAcademicFaculty(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'AcademicFaculty is retrieved successfully!',
        data: result,
    });
});
