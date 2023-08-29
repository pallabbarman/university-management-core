/*
  Warnings:

  - You are about to drop the `course_to_prerequisite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "course_to_prerequisite" DROP CONSTRAINT "course_to_prerequisite_courseId_fkey";

-- DropForeignKey
ALTER TABLE "course_to_prerequisite" DROP CONSTRAINT "course_to_prerequisite_preRequisiteId_fkey";

-- DropTable
DROP TABLE "course_to_prerequisite";

-- CreateTable
CREATE TABLE "course_prerequisite" (
    "courseId" TEXT NOT NULL,
    "preRequisiteId" TEXT NOT NULL,

    CONSTRAINT "course_prerequisite_pkey" PRIMARY KEY ("courseId","preRequisiteId")
);

-- AddForeignKey
ALTER TABLE "course_prerequisite" ADD CONSTRAINT "course_prerequisite_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_prerequisite" ADD CONSTRAINT "course_prerequisite_preRequisiteId_fkey" FOREIGN KEY ("preRequisiteId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
