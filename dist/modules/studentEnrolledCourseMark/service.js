"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMyCourseMarks = exports.editFinalMarks = exports.editStudentMarks = exports.findAllStudentEnrolledCourseMarks = exports.createStudentEnrolledCourseDefaultMark = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable comma-dangle */
const client_1 = require("@prisma/client");
const apiError_1 = __importDefault(require("../../errors/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = __importDefault(require("../../utils/pagination"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const utils_1 = require("./utils");
const createStudentEnrolledCourseDefaultMark = async (prismaClient, payload) => {
    const isExitMidtermData = await prismaClient.studentEnrolledCourseMark.findFirst({
        where: {
            examType: client_1.ExamType.MIDTERM,
            student: {
                id: payload.studentId,
            },
            studentEnrolledCourse: {
                id: payload.studentEnrolledCourseId,
            },
            semester: {
                id: payload.semesterId,
            },
        },
    });
    if (!isExitMidtermData) {
        await prismaClient.studentEnrolledCourseMark.create({
            data: {
                student: {
                    connect: {
                        id: payload.studentId,
                    },
                },
                studentEnrolledCourse: {
                    connect: {
                        id: payload.studentEnrolledCourseId,
                    },
                },
                semester: {
                    connect: {
                        id: payload.semesterId,
                    },
                },
                examType: client_1.ExamType.MIDTERM,
            },
        });
    }
    const isExistFinalData = await prismaClient.studentEnrolledCourseMark.findFirst({
        where: {
            examType: client_1.ExamType.FINAL,
            student: {
                id: payload.studentId,
            },
            studentEnrolledCourse: {
                id: payload.studentEnrolledCourseId,
            },
            semester: {
                id: payload.semesterId,
            },
        },
    });
    if (!isExistFinalData) {
        await prismaClient.studentEnrolledCourseMark.create({
            data: {
                student: {
                    connect: {
                        id: payload.studentId,
                    },
                },
                studentEnrolledCourse: {
                    connect: {
                        id: payload.studentEnrolledCourseId,
                    },
                },
                semester: {
                    connect: {
                        id: payload.semesterId,
                    },
                },
                examType: client_1.ExamType.FINAL,
            },
        });
    }
};
exports.createStudentEnrolledCourseDefaultMark = createStudentEnrolledCourseDefaultMark;
const findAllStudentEnrolledCourseMarks = async (filters, options) => {
    const { limit, page } = (0, pagination_1.default)(options);
    const marks = await prisma_1.default.studentEnrolledCourseMark.findMany({
        where: {
            student: {
                id: filters.studentId,
            },
            semester: {
                id: filters.semesterId,
            },
            studentEnrolledCourse: {
                course: {
                    id: filters.courseId,
                },
            },
        },
        include: {
            studentEnrolledCourse: {
                include: {
                    course: true,
                },
            },
            student: true,
        },
    });
    return {
        meta: {
            page,
            limit,
            total: marks.length,
        },
        data: marks,
    };
};
exports.findAllStudentEnrolledCourseMarks = findAllStudentEnrolledCourseMarks;
const editStudentMarks = async (payload) => {
    const { studentId, semesterId, courseId, examType, marks } = payload;
    const studentEnrolledCourseMarks = await prisma_1.default.studentEnrolledCourseMark.findFirst({
        where: {
            student: {
                id: studentId,
            },
            semester: {
                id: semesterId,
            },
            studentEnrolledCourse: {
                course: {
                    id: courseId,
                },
            },
            examType,
        },
    });
    if (!studentEnrolledCourseMarks) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Student enrolled course mark not found!');
    }
    const result = (0, utils_1.getGradeFromMarks)(marks);
    const updateStudentMarks = await prisma_1.default.studentEnrolledCourseMark.update({
        where: {
            id: studentEnrolledCourseMarks.id,
        },
        data: {
            marks,
            grade: result.grade,
        },
    });
    return updateStudentMarks;
};
exports.editStudentMarks = editStudentMarks;
const editFinalMarks = async (payload) => {
    const { studentId, semesterId, courseId } = payload;
    const studentEnrolledCourse = await prisma_1.default.studentEnrolledCourse.findFirst({
        where: {
            student: {
                id: studentId,
            },
            semester: {
                id: semesterId,
            },
            course: {
                id: courseId,
            },
        },
    });
    if (!studentEnrolledCourse) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Student enrolled course data not found!');
    }
    const studentEnrolledCourseMarks = await prisma_1.default.studentEnrolledCourseMark.findMany({
        where: {
            student: {
                id: studentId,
            },
            semester: {
                id: semesterId,
            },
            studentEnrolledCourse: {
                course: {
                    id: courseId,
                },
            },
        },
    });
    if (!studentEnrolledCourseMarks.length) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'student enrolled course mark not found!');
    }
    const midTermMarks = studentEnrolledCourseMarks.find((item) => item.examType === client_1.ExamType.MIDTERM)?.marks || 0;
    const finalTermMarks = studentEnrolledCourseMarks.find((item) => item.examType === client_1.ExamType.FINAL)?.marks || 0;
    const totalFinalMarks = Math.ceil(midTermMarks * 0.4) + Math.ceil(finalTermMarks * 0.6);
    const result = (0, utils_1.getGradeFromMarks)(totalFinalMarks);
    await prisma_1.default.studentEnrolledCourse.updateMany({
        where: {
            student: {
                id: studentId,
            },
            semester: {
                id: semesterId,
            },
            course: {
                id: courseId,
            },
        },
        data: {
            grade: result.grade,
            point: result.point,
            totalMarks: totalFinalMarks,
            status: client_1.StudentEnrolledCourseStatus.COMPLETED,
        },
    });
    const grades = await prisma_1.default.studentEnrolledCourse.findMany({
        where: {
            student: {
                id: studentId,
            },
            status: client_1.StudentEnrolledCourseStatus.COMPLETED,
        },
        include: {
            course: true,
        },
    });
    const academicResult = await (0, utils_1.calcCGPAandGrade)(grades);
    const studentAcademicInfo = await prisma_1.default.studentAcademicInfo.findFirst({
        where: {
            student: {
                id: studentId,
            },
        },
    });
    if (studentAcademicInfo) {
        await prisma_1.default.studentAcademicInfo.update({
            where: {
                id: studentAcademicInfo.id,
            },
            data: {
                totalCompletedCredit: academicResult.totalCompletedCredit,
                cgpa: academicResult.cgpa,
            },
        });
    }
    else {
        await prisma_1.default.studentAcademicInfo.create({
            data: {
                student: {
                    connect: {
                        id: studentId,
                    },
                },
                totalCompletedCredit: academicResult.totalCompletedCredit,
                cgpa: academicResult.cgpa,
            },
        });
    }
    return grades;
};
exports.editFinalMarks = editFinalMarks;
const findMyCourseMarks = async (filters, options, authUser) => {
    const { limit, page } = (0, pagination_1.default)(options);
    const student = await prisma_1.default.student.findFirst({
        where: {
            studentId: authUser.id,
        },
    });
    if (!student) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Student not found');
    }
    const marks = await prisma_1.default.studentEnrolledCourseMark.findMany({
        where: {
            student: {
                id: student.id,
            },
            semester: {
                id: filters.semesterId,
            },
            studentEnrolledCourse: {
                course: {
                    id: filters.courseId,
                },
            },
        },
        include: {
            studentEnrolledCourse: {
                include: {
                    course: true,
                },
            },
        },
    });
    return {
        meta: {
            page,
            limit,
            total: marks.length,
        },
        data: marks,
    };
};
exports.findMyCourseMarks = findMyCourseMarks;
