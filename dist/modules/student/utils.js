"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupBySemester = void 0;
const groupBySemester = (data) => {
    const groupData = data.reduce((result, course) => {
        const { semester } = course;
        const semesterId = semester.id;
        const existingGroup = result.find((group) => group.semester.id === semesterId);
        if (existingGroup) {
            existingGroup.completedCourses.push({
                id: course.id,
                createdAt: course.createdAt,
                updatedAt: course.updatedAt,
                courseId: course.courseId,
                studentId: course.studentId,
                grade: course.grade,
                point: course.point,
                totalMarks: course.totalMarks,
                course: course.course,
            });
        }
        else {
            result.push({
                semester,
                completedCourses: [
                    {
                        id: course.id,
                        createdAt: course.createdAt,
                        updatedAt: course.updatedAt,
                        courseId: course.courseId,
                        studentId: course.studentId,
                        grade: course.grade,
                        point: course.point,
                        totalMarks: course.totalMarks,
                        course: course.course,
                    },
                ],
            });
        }
        return result;
    }, []);
    return groupData;
};
exports.groupBySemester = groupBySemester;
