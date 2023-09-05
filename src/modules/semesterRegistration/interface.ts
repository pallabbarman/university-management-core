export interface ISemesterRegistrationFilter {
    searchTerm?: string;
    semesterId?: string;
}

export interface IEnrollCoursePayload {
    offeredCourseId: string;
    offeredCourseSectionId: string;
}
