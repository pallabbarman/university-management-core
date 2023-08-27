export interface IPrerequisiteCourseRequest {
    courseId: string;
    isDeleted?: null;
}

export interface ICourseCreateData {
    title: string;
    code: string;
    credits: number;
    preRequisiteCourses: IPrerequisiteCourseRequest[];
}

export interface ICourseFilter {
    searchTerm?: string;
}
