/* eslint-disable import/prefer-default-export */

import z from 'zod';

export const studentValidation = z.object({
    body: z.object({
        studentId: z.string({
            required_error: 'Student id is required!',
        }),
        firstName: z.string({
            required_error: 'First name is required!',
        }),
        lastName: z.string({
            required_error: 'Last name is required!',
        }),
        middleName: z.string({
            required_error: 'Middle name is required!',
        }),
        profileImage: z.string({
            required_error: 'Profile image is required!',
        }),
        email: z.string({
            required_error: 'Email is required!',
        }),
        contactNo: z.string({
            required_error: 'Contact no is required!',
        }),
        gender: z.string({
            required_error: 'Gender is required!',
        }),
        bloodGroup: z.string({
            required_error: 'Blood group is required!',
        }),
        semesterId: z.string({
            required_error: 'Semester is required!',
        }),
        departmentId: z.string({
            required_error: 'Department is required',
        }),
        academicFacultyId: z.string({
            required_error: 'Academic faculty is required',
        }),
    }),
});
