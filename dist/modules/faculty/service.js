"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMyCourseStudents = exports.findMyCourses = exports.removeCourses = exports.setCourses = exports.removeFaculty = exports.editFaculty = exports.findFaculty = exports.findAllFaculties = exports.insertFaculty = void 0;
const pagination_1 = __importDefault(require("../../utils/pagination"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const constant_1 = require("./constant");
const insertFaculty = async (data) => {
    const result = await prisma_1.default.faculty.create({
        data,
        include: {
            academicFaculty: true,
            department: true,
        },
    });
    return result;
};
exports.insertFaculty = insertFaculty;
const findAllFaculties = async (filters, options) => {
    const { searchTerm, ...filterData } = filters;
    const { limit, page, skip, sortBy, sortOrder } = (0, pagination_1.default)(options);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: constant_1.facultySearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                if (constant_1.facultyRelationalFields.includes(key)) {
                    return {
                        [constant_1.facultyRelationalFieldsMapper[key]]: {
                            id: filterData[key],
                        },
                    };
                }
                return {
                    [key]: {
                        equals: filterData[key],
                    },
                };
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.faculty.findMany({
        include: {
            academicFaculty: true,
            department: true,
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? { [sortBy]: sortOrder }
            : {
                createdAt: 'desc',
            },
    });
    const total = await prisma_1.default.faculty.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
exports.findAllFaculties = findAllFaculties;
const findFaculty = async (id) => {
    const result = await prisma_1.default.faculty.findUnique({
        where: {
            id,
        },
        include: {
            academicFaculty: true,
            department: true,
        },
    });
    return result;
};
exports.findFaculty = findFaculty;
const editFaculty = async (id, payload) => {
    const result = await prisma_1.default.faculty.update({
        where: {
            id,
        },
        data: payload,
        include: {
            academicFaculty: true,
            department: true,
        },
    });
    return result;
};
exports.editFaculty = editFaculty;
const removeFaculty = async (id) => {
    const result = await prisma_1.default.faculty.delete({
        where: {
            id,
        },
    });
    return result;
};
exports.removeFaculty = removeFaculty;
const setCourses = async (id, payload) => {
    await prisma_1.default.courseFaculty.createMany({
        data: payload.map((courseId) => ({
            courseId,
            facultyId: id,
        })),
    });
    const result = await prisma_1.default.courseFaculty.findMany({
        where: {
            facultyId: id,
        },
        include: {
            course: true,
        },
    });
    return result;
};
exports.setCourses = setCourses;
const removeCourses = async (id, payload) => {
    await prisma_1.default.courseFaculty.deleteMany({
        where: {
            facultyId: id,
            courseId: {
                in: payload,
            },
        },
    });
    const result = await prisma_1.default.courseFaculty.findMany({
        where: {
            facultyId: id,
        },
        include: {
            course: true,
        },
    });
    return result;
};
exports.removeCourses = removeCourses;
const findMyCourses = async (authUser, filter) => {
    if (!filter.semesterId) {
        const currentSemester = await prisma_1.default.semester.findFirst({
            where: {
                isCurrent: true,
            },
        });
        filter.semesterId = currentSemester?.id;
    }
    const offeredCourseSections = await prisma_1.default.offeredCourseSection.findMany({
        where: {
            offeredCourseClassSchedules: {
                some: {
                    faculty: {
                        facultyId: authUser.userId,
                    },
                },
            },
            offeredCourse: {
                semesterRegistration: {
                    semester: {
                        id: filter.semesterId,
                    },
                },
            },
        },
        include: {
            offeredCourse: {
                include: {
                    course: true,
                },
            },
            offeredCourseClassSchedules: {
                include: {
                    room: {
                        include: {
                            building: true,
                        },
                    },
                },
            },
        },
    });
    const courseAndSchedule = offeredCourseSections.reduce((acc, obj) => {
        const { course } = obj.offeredCourse;
        const classSchedules = obj.offeredCourseClassSchedules;
        const existingCourse = acc.find((item) => item.course?.id === course?.id);
        if (existingCourse) {
            existingCourse.sections.push({
                section: obj,
                classSchedules,
            });
        }
        else {
            acc.push({
                course,
                sections: [
                    {
                        section: obj,
                        classSchedules,
                    },
                ],
            });
        }
        return acc;
    }, []);
    return courseAndSchedule;
};
exports.findMyCourses = findMyCourses;
const findMyCourseStudents = async (filters, options, authUser) => {
    const { limit, page, skip } = (0, pagination_1.default)(options);
    console.log(authUser);
    if (!filters.semesterId) {
        const currentAcademicSemester = await prisma_1.default.semester.findFirst({
            where: {
                isCurrent: true,
            },
        });
        if (currentAcademicSemester) {
            filters.semesterId = currentAcademicSemester.id;
        }
    }
    const offeredCourseSections = await prisma_1.default.studentSemesterRegistrationCourse.findMany({
        where: {
            offeredCourse: {
                course: {
                    id: filters.courseId,
                },
            },
            offeredCourseSection: {
                offeredCourse: {
                    semesterRegistration: {
                        semester: {
                            id: filters.semesterId,
                        },
                    },
                },
                id: filters.offeredCourseSectionId,
            },
        },
        include: {
            student: true,
        },
        take: limit,
        skip,
    });
    const students = offeredCourseSections.map((offeredCourseSection) => offeredCourseSection.student);
    const total = await prisma_1.default.studentSemesterRegistrationCourse.count({
        where: {
            offeredCourse: {
                course: {
                    id: filters.courseId,
                },
            },
            offeredCourseSection: {
                offeredCourse: {
                    semesterRegistration: {
                        semester: {
                            id: filters.semesterId,
                        },
                    },
                },
                id: filters.offeredCourseSectionId,
            },
        },
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: students,
    };
};
exports.findMyCourseStudents = findMyCourseStudents;
