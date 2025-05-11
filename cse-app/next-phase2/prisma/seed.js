import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  // Step 1: Delete in correct dependency order
  await prisma.registration.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.completedCourse.deleteMany();
  await prisma.expertise.deleteMany();
  await prisma.coursePrerequisite.deleteMany();
  await prisma.class.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Step 2: Load data
  const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'));
  const courses = JSON.parse(fs.readFileSync('./data/courses.json', 'utf-8'));
  const classes = JSON.parse(fs.readFileSync('./data/classes.json', 'utf-8'));
  const registrations = JSON.parse(fs.readFileSync('./data/registrations.json', 'utf-8'));

  // Step 3: Seed users
  for (const user of users) {

    if (!user.id || !user.username || !user.password || !user.role) {
      console.warn(`Skipping user due to missing fields: ${JSON.stringify(user)}`);
      continue;
    }

    await prisma.user.create({ data: {
      id: user.id,
      username: user.username,
      password: user.password,
      role: user.role
    }});

    if (user.completedCourses?.length) {
      for (const course of user.completedCourses) {
        await prisma.completedCourse.create({
          data: {
            studentId: user.id,
            courseId: course.courseId,
            classId: course.classId,
            grade: course.grade
          }
        });
      }
    }

    if (user.expertise?.length) {
      for (const area of user.expertise) {
        await prisma.expertise.create({
          data: {
            userId: user.id,
            area
          }
        });
      }
    }
  }

  // Step 4: Seed courses and prerequisites
  for (const course of courses) {
    await prisma.course.create({
      data: {
        id: course.id,
        name: course.name,
        category: course.category,
        status: course.status
      }
    });

    for (const prereq of course.prerequisites) {
      await prisma.coursePrerequisite.create({
        data: {
          courseId: course.id,
          prerequisiteId: prereq
        }
      });
    }
  }

  // Step 5: Seed classes and enrollments
  for (const cls of classes) {
    await prisma.class.create({
      data: {
        classId: cls.classId,
        courseId: cls.courseId,
        instructorId: cls.instructorId,
        time: cls.time,
        maxSeats: cls.maxSeats,
        status: cls.status
      }
    });

    for (const studentId of cls.enrolledStudentIds) {
      await prisma.enrollment.create({
        data: {
          classId: cls.classId,
          studentId
        }
      });
    }
  }

  // Step 6: Seed registrations
  for (const reg of registrations) {
    await prisma.registration.create({
      data: {
        studentId: reg.studentId,
        courseId: reg.courseId,
        classId: reg.classId,
        status: reg.status
      }
    });
  }

  console.log('✅ Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
  })
  .finally(() => prisma.$disconnect());