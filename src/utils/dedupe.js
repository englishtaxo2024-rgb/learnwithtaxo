export function dedupeStudents(students = []) {
  const seen = new Map();
  const duplicates = [];
  students.forEach((student) => {
    const key = student.id || `${student.name}-${student.phone}-${student.parentEmail}`.toLowerCase();
    if (seen.has(key)) duplicates.push(student);
    else seen.set(key, student);
  });
  return { rows: [...seen.values()], duplicates };
}
