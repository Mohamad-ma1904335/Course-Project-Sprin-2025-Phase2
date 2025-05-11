import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAllCourses() {
  return prisma.course.findMany({
    include: {
      classes: true
    }
  });
}

export async function getCoursesByCategory(category) {
  return prisma.course.findMany({
    where: { category },
    include: { classes: true }
  });
}

export async function getCourseWithPrerequisites(courseId) {
  return prisma.course.findUnique({
    where: { id: courseId },
    include: {
      prerequisites: {
        include: { prerequisite: true }
      }
    }
  });
}

export async function createCourse(data) {
  return prisma.course.create({ data });
}
