export interface IFacultyFilters {
    searchTerm?: string;
    academicFacultyId?: string;
    departmentId?: string;
    email?: string;
    contactNo?: string;
    gender?: string;
    bloodGroup?: string;
    designation?: string;
}

export type IFacultyMyCourseStudents = {
    semesterId?: string;
    courseId?: string;
    offeredCourseSectionId?: string;
};
