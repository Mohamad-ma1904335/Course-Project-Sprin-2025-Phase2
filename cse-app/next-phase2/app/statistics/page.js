'use client';
import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend);

function barChart(labels, data, label) {
  return {
    labels,
    datasets: [{
      label,
      data,
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };
}

function pieChart(labels, data) {
  return {
    labels,
    datasets: [{
      label: "Distribution",
      data,
      backgroundColor: ['#36a2eb', '#ff6384', '#ffcd56', '#4bc0c0', '#9966ff', '#ff9f40']
    }]
  };
}

export default function StatisticsPage() {
  
// async
//  const session = await getServerSession(authOptions);

//  if (!session) {
//    return <p>You must log in to view this page.</p>;
//  }

//  return (
//    <div>
//      <h1>📈 Protected Statistics</h1>
//      {/* stats content here */}
//    </div>
//  );

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/statistics')
      .then(res => res.json())
      .then(data => {
        console.log("📊 Stats Loaded:", data);
        setStats(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching statistics:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</p>;
  if (!stats) return <p style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>Failed to load statistics.</p>;

  return (
    <main className="dashboard">
      <h1 className="dashboard-title">📈 Student Management Statistics</h1>
      <div className="grid-container">

        <div className="card">
          <h3>🧑‍🎓 Students Per Year</h3>
          {stats.studentsPerYear
            ? <Bar data={barChart(Object.keys(stats.studentsPerYear), Object.values(stats.studentsPerYear), "Students")} />
            : <p>No data</p>}
        </div>

        <div className="card">
          <h3>📂 Students per Category</h3>
          {stats.countPerCategory
            ? <Pie data={pieChart(Object.keys(stats.countPerCategory), Object.values(stats.countPerCategory))} />
            : <p>No data</p>}
        </div>

        <div className="card">
          <h3>🏆 Top Courses</h3>
          {stats.topCourses?.length
            ? <ul>{stats.topCourses.map(c => <li key={c.courseId}>{c.courseId} — {c._count} registrations</li>)}</ul>
            : <p>No top courses found</p>}
        </div>

        <div className="card">
          <h3>📉 Failure Rate per Course</h3>
          {stats.failureRates
            ? <Bar data={barChart(Object.keys(stats.failureRates), Object.values(stats.failureRates), "Failure Rate (%)")} />
            : <p>No data</p>}
        </div>

        <div className="card">
          <h3>👨‍🏫 Instructor Load</h3>
          {stats.instructorLoads
            ? <Bar data={barChart(Object.keys(stats.instructorLoads), Object.values(stats.instructorLoads), "Classes")} />
            : <p>No data</p>}
        </div>

        <div className="card">
          <h3>📘 Registrations per Course</h3>
          {stats.courseRegistrations
            ? <Bar data={barChart(Object.keys(stats.courseRegistrations), Object.values(stats.courseRegistrations), "Registrations")} />
            : <p>No data</p>}
        </div>

        <div className="card">
          <h3>📅 Class Status</h3>
          {typeof stats.pendingClasses === 'number' && typeof stats.approvedClasses === 'number'
            ? <Pie data={pieChart(["Pending", "Approved"], [stats.pendingClasses, stats.approvedClasses])} />
            : <p>No data</p>}
        </div>

        <div className="card">
          <h3>🎓 Top Students</h3>
          {stats.topStudents?.length
            ? <ul>{stats.topStudents.map(s => <li key={s.id}>{s.id}: {s._count.completedCourses} courses</li>)}</ul>
            : <p>No data</p>}
        </div>

        <div className="card">
          <h3>📋 Most Common Grades</h3>
          {stats.commonGrades
            ? <Bar data={barChart(Object.keys(stats.commonGrades), Object.values(stats.commonGrades), "Occurrences")} />
            : <p>No data</p>}
        </div>

        <div className="card">
          <h3>🧑‍🏫 Students per Instructor (Approved Classes)</h3>
          {stats.instructorStudentLoads
            ? <Bar data={barChart(Object.keys(stats.instructorStudentLoads), Object.values(stats.instructorStudentLoads), "Students")} />
            : <p>No data</p>}
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          padding: 2rem;
          background-color: #f9fafb;
          color: #1f2937;
          font-family: 'Segoe UI', sans-serif;
        }

        .dashboard-title {
          text-align: center;
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 2rem;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .card {
          background: #ffffff;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          transition: 0.2s ease;
        }

        .card h3 {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .card ul {
          padding-left: 1rem;
          line-height: 1.6;
        }
      `}</style>
    </main>
  );
}
