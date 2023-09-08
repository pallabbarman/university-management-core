export const offeredCourseFilterableFields: string[] = [
    'searchTerm',
    'id',
    'semesterRegistrationId',
    'courseId',
    'departmentId',
];

export const offeredCourseSearchableFields: string[] = [];

export const offeredCourseRelationalFields: string[] = [
    'semesterRegistrationId',
    'courseId',
    'departmentId',
];

export const offeredCourseRelationalFieldsMapper: { [key: string]: string } = {
    semesterRegistrationId: 'semesterRegistration',
    courseId: 'course',
    departmentId: 'department',
};
