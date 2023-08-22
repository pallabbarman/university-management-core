"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentRelationalFieldsMapper = exports.studentRelationalFields = exports.studentSearchableFields = exports.studentFilterableFields = void 0;
exports.studentFilterableFields = [
    'searchTerm',
    'studentId',
    'email',
    'contactNo',
    'gender',
    'bloodGroup',
    'gender',
    'academicFacultyId',
    'departmentId',
    'semesterId',
];
exports.studentSearchableFields = [
    'firstName',
    'lastName',
    'middleName',
    'email',
    'contactNo',
    'studentId',
];
exports.studentRelationalFields = [
    'academicFacultyId',
    'departmentId',
    'semesterId',
];
exports.studentRelationalFieldsMapper = {
    academicFacultyId: 'academicFaculty',
    departmentId: 'department',
    semesterId: 'semester',
};
