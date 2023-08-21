export const facultyFilterableFields: string[] = [
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

export const facultySearchableFields: string[] = [
    'firstName',
    'lastName',
    'middleName',
    'email',
    'contactNo',
    'facultyId',
    'designation',
];

export const facultyRelationalFields: string[] = ['academicFacultyId', 'departmentId'];

export const facultyRelationalFieldsMapper: { [key: string]: string } = {
    academicFacultyId: 'academicFaculty',
    departmentId: 'department',
};
