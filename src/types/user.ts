import { Model, Types } from 'mongoose';
import { IAdmin } from './admin';
import { IFaculty } from './faculty';
import { IStudent } from './students';

export interface IUser {
    id: string;
    role: string;
    password: string;
    needsChangePassword: boolean;
    passwordChangedAt?: Date;
    student?: Types.ObjectId | IStudent;
    faculty?: Types.ObjectId | IFaculty;
    admin?: Types.ObjectId | IAdmin;
}

export interface IUserMethods {
    isUserExist(id: string): Promise<Partial<IUser | null>>;
    isPasswordMatched(givenPassword: string, savedPassword: string): Promise<boolean>;
}

export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;

export type UserName = {
    firstName: string;
    lastName: string;
    middleName: string;
};

// eslint-disable-next-line no-shadow
export enum USER_ROLE {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    STUDENT = 'student',
    FACULTY = 'faculty',
}
