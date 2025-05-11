import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function registerStudent({ studentId, classId, courseId }) {
  return prisma.registration.create({
    data: {
      studentId,
      classId,
      courseId,
      status: "pending"
    }
  });
}

export async function getStudentRegistrations(studentId) {
  return prisma.registration.findMany({
    where: { studentId },
    include: {
      class: {
        include: { instructor: true, course: true }
      }
    }
  });
}

export async function updateRegistrationStatus(classId, status) {
  return prisma.registration.updateMany({
    where: { classId },
    data: { status }
  });
}

export async function dropRegistration(studentId, classId) {
  return prisma.registration.deleteMany({
    where: {
      studentId,
      classId
    }
  });
}
