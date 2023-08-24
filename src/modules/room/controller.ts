/* eslint-disable object-curly-newline */
import { Room } from '@prisma/client';
import paginationFields from 'constants/pagination';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from 'utils/catchAsync';
import pick from 'utils/pick';
import sendResponse from 'utils/sendResponse';
import { roomFilterableFields } from './constant';
import { editRoom, findAllRooms, findRoom, insertRoom, removeRoom } from './service';

export const createRoom = catchAsync(async (req: Request, res: Response) => {
    const result = await insertRoom(req.body);

    sendResponse<Room>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Room created successfully!',
        data: result,
    });
});

export const getAllRooms = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, roomFilterableFields);
    const options = pick(req.query, paginationFields);

    const result = await findAllRooms(filters, options);

    sendResponse<Room[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Rooms is retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});

export const getRoom = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await findRoom(id);

    sendResponse<Room>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Room is retrieved successfully!',
        data: result,
    });
});

export const updateRoom = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await editRoom(id, req.body);

    sendResponse<Room>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Room is updated successfully!',
        data: result,
    });
});

export const deleteRoom = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id;
    const result = await removeRoom(id);

    sendResponse<Room>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Room deleted successfully!',
        data: result,
    });
});
