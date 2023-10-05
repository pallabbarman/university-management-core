import { WeekDays } from '@prisma/client';

export interface IOfferedCourseSectionFilter {
    searchTerm?: string;
    offeredCourseId?: string;
}

export interface IClassSchedule {
    startTime: string;
    endTime: string;
    dayOfWeek: WeekDays;
    roomId: string;
    facultyId: string;
}

export interface IOfferedCourseSectionCreate {
    title: string;
    maxCapacity: number;
    offeredCourseId: string;
    classSchedules: IClassSchedule[];
}
