import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getCompletedCourses(studentId) {
  return prisma.completedCourse.findMany({
    where: { studentId },
    include: {
      course: true
    }
  });
}

export async function getUserWithRole(username, password) {
  return prisma.user.findFirst({
    where: {
      username,
      password
    }
  });
}

export async function getInstructorExpertise(userId) {
  return prisma.expertise.findMany({
    where: { userId }
  });
}
