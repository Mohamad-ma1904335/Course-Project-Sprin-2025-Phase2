import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getClassesByCourseId(courseId) {
  return prisma.class.findMany({
    where: { courseId },
    include: {
      instructor: true
    }
  });
}

export async function getInstructorClasses(instructorId) {
  return prisma.class.findMany({
    where: { instructorId },
    include: {
      course: true,
      enrollments: {
        include: {
          student: true
        }
      }
    }
  });
}

export async function approveClass(classId) {
  return prisma.class.update({
    where: { classId },
    data: { status: "approved" }
  });
}

export async function cancelClass(classId) {
  return prisma.class.update({
    where: { classId },
    data: { status: "canceled" }
  });
}

export async function createClass(data) {
  return prisma.class.create({ data });
}
