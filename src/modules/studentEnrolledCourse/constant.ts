export const studentEnrolledCourseFilterableFields: string[] = [
    'semesterId',
    'studentId',
    'courseId',
    'status',
    'grade',
];

export const studentEnrolledCourseSearchableFields: string[] = [];

export const studentEnrolledCourseRelationalFields: string[] = [
    'semesterId',
    'studentId',
    'courseId',
];

export const studentEnrolledCourseRelationalFieldsMapper: { [key: string]: string } = {
    semesterId: 'semester',
    studentId: 'student',
    courseId: 'course',
};
