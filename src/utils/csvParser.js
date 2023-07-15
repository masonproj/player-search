import Papa from 'papaparse';

export const parseCSV = (csvString) => {
  const { data, errors } = Papa.parse(csvString, { header: true });
  if (errors.length > 0) {
    console.error('CSV parsing error:', errors);
    return [];
  }
  return data;
};

export const filterByPlayerName = (data, firstName, lastName) => {
  return data.filter(
    (row) =>
      row.FIRST_NAME.toLowerCase() === firstName.toLowerCase() &&
      row.LAST_NAME.toLowerCase() === lastName.toLowerCase()
  );
};

export const filterByTeam = (data, teamName) => {
  return data.filter(
    (row) => row.TEAMS.toLowerCase().includes(teamName.toLowerCase())
  );
};
