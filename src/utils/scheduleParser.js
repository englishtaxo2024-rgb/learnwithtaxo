import { teacherNames } from '../config/teachers';

export function parseScheduleRows(rows = []) {
  let currentTeacher = null;
  const groups = [];
  const review = [];

  rows.forEach((row, index) => {
    const values = Object.values(row).map(String);
    const header = values.find((value) => teacherNames.includes(value.trim()));
    if (header) {
      currentTeacher = header.trim();
      return;
    }

    if (!row['Group Name'] && !row.groupName) return;
    if (!currentTeacher) {
      review.push({ index, reason: 'Missing teacher section header', row });
      return;
    }

    groups.push({
      teacher: currentTeacher,
      groupName: row['Group Name'] || row.groupName,
      days: row.Days || row.Day,
      time: row.Time,
      material: row.Material,
      sessions: Number(row['Number of sessions'] || row.sessions || 0),
      type: /private/i.test(row['Group Name'] || '') ? 'Private' : 'Group',
      raw: row
    });
  });

  return { groups, review };
}
