"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_SEMESTER_DELETED = exports.EVENT_SEMESTER_UPDATED = exports.EVENT_SEMESTER_CREATED = exports.semesterTitleCodeMapper = exports.semesterSearchAbleFields = exports.semesterFilterableFields = void 0;
exports.semesterFilterableFields = ['searchTerm', 'code', 'startMonth', 'endMonth'];
exports.semesterSearchAbleFields = ['title', 'code', 'startMonth', 'endMonth'];
exports.semesterTitleCodeMapper = {
    Autumn: '01',
    Summer: '02',
    Fall: '03',
};
exports.EVENT_SEMESTER_CREATED = 'semester-created';
exports.EVENT_SEMESTER_UPDATED = 'semester-updated';
exports.EVENT_SEMESTER_DELETED = 'semester-deleted';
