import { NextResponse } from 'next/server';
import {
  getStudentsPerYear,
  getStudentCountPerCategory,
  getTopCourses,
  getFailureRates,
  getInstructorLoads,
  getCourseRegistrations,
  getPendingAndApprovedCounts,
  getTopStudents,
  getCommonGrades,
  getInstructorStudentLoads
} from '@/repo/statisticsRepo';

export async function GET() {
  try {
    const [
      studentsPerYear,
      countPerCategory,
      topCourses,
      failureRates,
      instructorLoads,
      courseRegistrations,
      pendingAndApproved,
      topStudents,
      commonGrades,
      instructorStudentLoads
    ] = await Promise.all([
      getStudentsPerYear(),
      getStudentCountPerCategory(),
      getTopCourses(),
      getFailureRates(),
      getInstructorLoads(),
      getCourseRegistrations(),
      getPendingAndApprovedCounts(),
      getTopStudents(),
      getCommonGrades(),
      getInstructorStudentLoads()
    ]);

    const { pending: pendingClasses, approved: approvedClasses } = pendingAndApproved;

    return NextResponse.json({
      studentsPerYear,
      countPerCategory,
      topCourses,
      failureRates,
      instructorLoads,
      courseRegistrations,
      pendingClasses,
      approvedClasses,
      topStudents,
      commonGrades,
      instructorStudentLoads
    });
  } catch (error) {
    console.error("Error generating statistics:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
