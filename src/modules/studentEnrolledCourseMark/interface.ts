import { ExamType } from '@prisma/client';

export type IStudentEnrolledCourseMarkFilter = {
    searchTerm?: string;
    semesterId?: string;
    studentId?: string;
    studentEnrolledCourseId?: string;
    courseId?: string;
};

export type IUpdateStudentMarksPayload = {
    semesterId: string;
    studentId: string;
    courseId: string;
    examType: ExamType;
    marks: number;
};

export type IUpdateStudentCourseFinalMarksPayload = {
    semesterId: string;
    studentId: string;
    courseId: string;
};
