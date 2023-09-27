/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */

export const groupBySemester = (data: any) => {
    const groupData = data.reduce((result: any, course: any) => {
        const { semester } = course;
        const semesterId = semester.id;

        const existingGroup = result.find((group: any) => group.semester.id === semesterId);

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
        } else {
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
