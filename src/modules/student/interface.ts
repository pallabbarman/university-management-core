export interface IStudentFilter {
    searchTerm?: string;
    academicFacultyId?: string;
    departmentId?: string;
    semesterId?: string;
    studentId?: string;
    email?: string;
    contactNo?: string;
    gender?: string;
    bloodGroup?: string;
}

export interface IStudentMyCourses {
    semesterId?: string;
    courseId?: string;
}

export interface IStudentMyCourseSchedules {
    semesterId?: string;
    courseId?: string;
}

export interface StudentCreatedEvent {
    id: string;
    name: {
        firstName: string;
        lastName: string;
        middleName?: string;
    };
    dateOfBirth: string;
    gender: string;
    bloodGroup: string;
    email: string;
    contactNo: string;
    profileImage: string;
    academicFaculty: {
        syncId: string;
    };
    department: {
        syncId: string;
    };
    semester: {
        syncId: string;
    };
}

export type StudentUpdatedEvent = {
    id: string;
    name: {
        firstName: string;
        lastName: string;
        middleName?: string;
    };
    dateOfBirth: string;
    gender: string;
    bloodGroup: string;
    email: string;
    contactNo: string;
    profileImage: string;
    academicFaculty: {
        syncId: string;
    };
    department: {
        syncId: string;
    };
    semester: {
        syncId: string;
    };
};
