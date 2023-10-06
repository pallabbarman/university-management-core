export const semesterFilterableFields = ['searchTerm', 'code', 'startMonth', 'endMonth'];

export const semesterSearchAbleFields = ['title', 'code', 'startMonth', 'endMonth'];

export const semesterTitleCodeMapper: { [key: string]: string } = {
    Autumn: '01',
    Summer: '02',
    Fall: '03',
};

export const EVENT_SEMESTER_CREATED = 'semester-created';
export const EVENT_SEMESTER_UPDATED = 'semester-updated';
export const EVENT_SEMESTER_DELETED = 'semester-deleted';
