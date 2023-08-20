/* eslint-disable import/prefer-default-export */
import { AcademicFaculty } from '@prisma/client';
import prisma from 'utils/prisma';

export const insertAcademicFaculty = async (data: AcademicFaculty): Promise<AcademicFaculty> => {
    const result = await prisma.academicFaculty.create({
        data,
    });

    return result;
};
