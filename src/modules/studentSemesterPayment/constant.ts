export const studentSemesterPaymentFilterableFields: string[] = ['semesterId', 'studentId'];

export const studentSemesterPaymentSearchableFields: string[] = [];

export const studentSemesterPaymentRelationalFields: string[] = ['semesterId', 'studentId'];

export const studentSemesterPaymentRelationalFieldsMapper: { [key: string]: string } = {
    semesterId: 'Semester',
    studentId: 'student',
};
