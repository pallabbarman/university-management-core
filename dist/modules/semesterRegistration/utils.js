"use strict";
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableCourses = void 0;
const getAvailableCourses = (offeredCourses, studentCompletedCourses, studentCurrentlyTakanCourses) => {
    const completedCoursesId = studentCompletedCourses.map((course) => course.courseId);
    const availableCoursesList = offeredCourses
        .filter((offeredCourse) => !completedCoursesId.includes(offeredCourse.courseId))
        .filter((course) => {
        const preRequisites = course.course.preRequisite;
        if (preRequisites.length === 0) {
            return true;
        }
        const preRequisiteIds = preRequisites.map((preRequisite) => preRequisite.preRequisiteId);
        return preRequisiteIds.every((id) => completedCoursesId.includes(id));
    })
        .map((course) => {
        const isAlreadyTakenCourse = studentCurrentlyTakanCourses.find((c) => c.offeredCourseId === course.id);
        if (isAlreadyTakenCourse) {
            course.offeredCourseSections.map((section) => {
                if (section.id === isAlreadyTakenCourse.offeredCourseSectionId) {
                    section.isTaken = true;
                }
                else {
                    section.isTaken = false;
                }
            });
            return {
                ...course,
                isTaken: true,
            };
        }
        course.offeredCourseSections.map((section) => {
            section.isTaken = false;
        });
        return {
            ...course,
            isTaken: false,
        };
    });
    return availableCoursesList;
};
exports.getAvailableCourses = getAvailableCourses;
