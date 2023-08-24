import { Building } from '@prisma/client';
import paginationFields from 'constants/pagination';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from 'utils/catchAsync';
import pick from 'utils/pick';
import sendResponse from 'utils/sendResponse';
import { buildingFilterableFields } from './constant';
import {
    editBuilding,
    findAllBuildings,
    findBuilding,
    insertBuilding,
    removeBuilding,
} from './service';

export const createBuilding = catchAsync(async (req: Request, res: Response) => {
    const result = await insertBuilding(req.body);

    sendResponse<Building>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Building is created successfully!',
        data: result,
    });
});

export const getAllBuildings = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, buildingFilterableFields);
    const options = pick(req.query, paginationFields);

    const result = await findAllBuildings(filters, options);

    sendResponse<Building[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Buildings is retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});

export const getBuilding = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await findBuilding(id);

    sendResponse<Building>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Building is retrieved successfully!',
        data: result,
    });
});

export const updateBuilding = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await editBuilding(id, req.body);

    sendResponse<Building>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Building is updated successfully!',
        data: result,
    });
});

export const deleteBuilding = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await removeBuilding(id);

    sendResponse<Building>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Building deleted successfully!',
        data: result,
    });
});
