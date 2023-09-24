export const studentEnrolledCourseMarkFilterableFields: string[] = [
    'semesterId',
    'studentId',
    'studentEnrolledCourseId',
    'examType',
    'courseId',
];

export const studentEnrolledCourseMarkSearchableFields: string[] = ['examType', 'grade'];

export const studentEnrolledCourseMarkRelationalFields: string[] = [
    'semesterId',
    'studentId',
    'studentEnrolledCourseId',
];

export const studentEnrolledCourseMarkRelationalFieldsMapper: { [key: string]: string } = {
    semesterId: 'semester',
    studentId: 'student',
    studentEnrolledCourseId: 'studentEnrolledCourse',
};
