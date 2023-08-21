export const departmentFilterableFields: string[] = ['searchTerm', 'id', 'academicFacultyId'];

export const departmentSearchableFields: string[] = ['title'];

export const departmentRelationalFields: string[] = ['academicFacultyId'];

export const departmentRelationalFieldsMapper: { [key: string]: string } = {
    academicFacultyId: 'academicFaculty',
};
