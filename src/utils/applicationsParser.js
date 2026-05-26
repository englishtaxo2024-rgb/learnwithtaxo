export function parseApplications(rows = []) {
  return rows.map((row, index) => ({
    id: row.id || `imported-app-${index}`,
    studentName: row['Student Name'] || row.studentName,
    parentEmail: row['Parent Email'] || row.parentEmail,
    phone: row.Phone || row.phone,
    requestedCourse: row.Course || row.requestedCourse,
    needsReview: !row.Phone || !row.Course
  }));
}
