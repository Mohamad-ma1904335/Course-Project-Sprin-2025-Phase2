import { prisma } from '@/lib/prisma';

// 1. Students per Year
export async function getStudentsPerYear() {
  const students = await prisma.user.findMany({
    where: { role: 'student' },
    select: { id: true }
  });

  const counts = {};
  students.forEach(s => {
    const year = s.id.substring(0, 4); // e.g. "2019"
    counts[year] = (counts[year] || 0) + 1;
  });
  return counts;
}

// 2. Student count per course category
export async function getStudentCountPerCategory() {
  const courses = await prisma.course.findMany({ select: { id: true, category: true } });
  const registrations = await prisma.registration.findMany();

  const categoryMap = {};
  for (const c of courses) categoryMap[c.id] = c.category;

  const counts = {};
  for (const r of registrations) {
    const cat = categoryMap[r.courseId] || 'Unknown';
    counts[cat] = (counts[cat] || 0) + 1;
  }
  return counts;
}

// 3. Top courses by registration count
export async function getTopCourses() {
  const top = await prisma.registration.groupBy({
    by: ['courseId'],
    _count: true,
    orderBy: { _count: { courseId: 'desc' } },
    take: 3
  });
  return top;
}

// 4. Failure rate per course
export async function getFailureRates() {
  const users = await prisma.user.findMany({
    where: { role: 'student' },
    select: { completedCourses: true }
  });

  const fails = {};
  const totals = {};

  users.forEach(user => {
    user.completedCourses.forEach(c => {
      totals[c.courseId] = (totals[c.courseId] || 0) + 1;
      if (['F', 'FA', 'FB'].includes(c.grade)) {
        fails[c.courseId] = (fails[c.courseId] || 0) + 1;
      }
    });
  });

  const failureRates = {};
  for (const courseId in totals) {
    failureRates[courseId] = Math.round((fails[courseId] || 0) / totals[courseId] * 100);
  }
  return failureRates;
}

// 5. Instructor load
export async function getInstructorLoads() {
  const classes = await prisma.class.findMany();
  const result = {};
  for (const c of classes) {
    result[c.instructorId] = (result[c.instructorId] || 0) + 1;
  }
  return result;
}

// 6. Course registration totals
export async function getCourseRegistrations() {
  const registrations = await prisma.registration.findMany();
  const result = {};
  for (const r of registrations) {
    result[r.courseId] = (result[r.courseId] || 0) + 1;
  }
  return result;
}

// 7. Pending vs approved
export async function getPendingAndApprovedCounts() {
  const all = await prisma.class.findMany({ select: { status: true } });
  let pending = 0, approved = 0;
  all.forEach(c => {
    if (c.status === 'pending') pending++;
    if (c.status === 'approved') approved++;
  });
  return { pending, approved };
}

// 8. Top students
export async function getTopStudents() {
  return await prisma.user.findMany({
    where: { role: 'student' },
    select: {
      id: true,
      completedCourses: true,
      _count: {
        select: { completedCourses: true }
      }
    },
    orderBy: { completedCourses: { _count: 'desc' } },
    take: 5
  });
}

// 9. Common grades
export async function getCommonGrades() {
  const users = await prisma.user.findMany({
    where: { role: 'student' },
    select: { completedCourses: true }
  });

  const result = {};
  users.forEach(u => {
    u.completedCourses.forEach(c => {
      result[c.grade] = (result[c.grade] || 0) + 1;
    });
  });

  return result;
}

// 10. Instructor Load Distribution
export async function getInstructorStudentLoads() {
  const classes = await prisma.class.findMany({
    where: { status: "approved" },
    include: { enrollments: true }
  });

  const instructorLoads = {};

  for (const cls of classes) {
    const instructorId = cls.instructorId;
    if (!instructorLoads[instructorId]) {
      instructorLoads[instructorId] = 0;
    }
    instructorLoads[instructorId] += cls.enrollments.length;
  }

  return instructorLoads;
}

