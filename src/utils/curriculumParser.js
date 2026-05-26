export function parseCurriculumRows(rows = []) {
  return rows
    .filter((row) => row.Active !== false && row.Active !== 'FALSE')
    .map((row) => ({
      teacherOrGroup: row['Teacher / Groups'],
      sessionOne: row['Session one'],
      sessionTwo: row['Session Two'],
      type: row.Type,
      question: row.Question,
      choices: [row.OptionA, row.OptionB, row.OptionC, row.OptionD].filter(Boolean),
      correct: row.Correct,
      meta: row.Meta
    }));
}
