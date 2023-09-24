"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentEnrolledCourseRelationalFieldsMapper = exports.studentEnrolledCourseRelationalFields = exports.studentEnrolledCourseSearchableFields = exports.studentEnrolledCourseFilterableFields = void 0;
exports.studentEnrolledCourseFilterableFields = [
    'semesterId',
    'studentId',
    'courseId',
    'status',
    'grade',
];
exports.studentEnrolledCourseSearchableFields = [];
exports.studentEnrolledCourseRelationalFields = [
    'semesterId',
    'studentId',
    'courseId',
];
exports.studentEnrolledCourseRelationalFieldsMapper = {
    semesterId: 'semester',
    studentId: 'student',
    courseId: 'course',
};
