export const studentFilterableFields: string[] = [
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

export const studentSearchableFields: string[] = [
    'firstName',
    'lastName',
    'middleName',
    'email',
    'contactNo',
    'studentId',
];

export const studentRelationalFields: string[] = [
    'academicFacultyId',
    'departmentId',
    'semesterId',
];

export const studentRelationalFieldsMapper: { [key: string]: string } = {
    academicFacultyId: 'academicFaculty',
    departmentId: 'department',
    semesterId: 'semester',
};
