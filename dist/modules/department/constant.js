"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentRelationalFieldsMapper = exports.departmentRelationalFields = exports.departmentSearchableFields = exports.departmentFilterableFields = void 0;
exports.departmentFilterableFields = ['searchTerm', 'id', 'academicFacultyId'];
exports.departmentSearchableFields = ['title'];
exports.departmentRelationalFields = ['academicFacultyId'];
exports.departmentRelationalFieldsMapper = {
    academicFacultyId: 'academicFaculty',
};
