import { Department } from '@prisma/client';
import prisma from 'utils/prisma';

export const insertDepartment = async (data: Department): Promise<Department> => {
    const result = await prisma.department.create({
        data,
        include: {
            academicFaculty: true,
        },
    });

    return result;
};

export const findDepartment = async (id: string): Promise<Department | null> => {
    const result = await prisma.department.findUnique({
        where: { id },
        include: {
            academicFaculty: true,
        },
    });

    return result;
};
