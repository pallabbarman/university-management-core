export interface ICreateOfferedCourse {
    courseIds: string[];
    departmentId: string;
    semesterRegistrationId: string;
}

export interface IOfferedCourseFilter {
    searchTerm?: string;
    courseId?: string;
    departmentId?: string;
    semesterRegistrationId?: string;
}
