import { Model, Types } from 'mongoose';
import { IAcademicFaculty } from './academicFaculty';
import { IDepartment } from './department';
import { UserName } from './user';

export type IFaculty = {
    id: string;
    name: UserName;
    profileImage: string;
    dateOfBirth?: string;
    email: string;
    contactNo: string;
    emergencyContactNo: string;
    gender?: 'male' | 'female';
    permanentAddress?: string;
    presentAddress?: string;
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    department: Types.ObjectId | IDepartment;
    academicFaculty: Types.ObjectId | IAcademicFaculty;
    designation: string;
};

export type FacultyModel = Model<IFaculty, Record<string, unknown>>;

export type IFacultyFilters = {
    searchTerm?: string;
    id?: string;
    email?: string;
    contactNo?: string;
    emergencyContactNo?: string;
    gender?: 'male' | 'female';
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    department?: string;
    academicFaculty?: string;
    designation?: string;
};
