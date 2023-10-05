"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentEnrolledCourseMarkRelationalFieldsMapper = exports.studentEnrolledCourseMarkRelationalFields = exports.studentEnrolledCourseMarkSearchableFields = exports.studentEnrolledCourseMarkFilterableFields = void 0;
exports.studentEnrolledCourseMarkFilterableFields = [
    'semesterId',
    'studentId',
    'studentEnrolledCourseId',
    'examType',
    'courseId',
];
exports.studentEnrolledCourseMarkSearchableFields = ['examType', 'grade'];
exports.studentEnrolledCourseMarkRelationalFields = [
    'semesterId',
    'studentId',
    'studentEnrolledCourseId',
];
exports.studentEnrolledCourseMarkRelationalFieldsMapper = {
    semesterId: 'semester',
    studentId: 'student',
    studentEnrolledCourseId: 'studentEnrolledCourse',
};
