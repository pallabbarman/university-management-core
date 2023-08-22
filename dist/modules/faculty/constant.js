"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facultyRelationalFieldsMapper = exports.facultyRelationalFields = exports.facultySearchableFields = exports.facultyFilterableFields = void 0;
exports.facultyFilterableFields = [
    'searchTerm',
    'facultyId',
    'email',
    'contactNo',
    'gender',
    'bloodGroup',
    'gender',
    'designation',
    'academicFacultyId',
    'departmentId',
];
exports.facultySearchableFields = [
    'firstName',
    'lastName',
    'middleName',
    'email',
    'contactNo',
    'facultyId',
    'designation',
];
exports.facultyRelationalFields = ['academicFacultyId', 'departmentId'];
exports.facultyRelationalFieldsMapper = {
    academicFacultyId: 'academicFaculty',
    departmentId: 'department',
};
