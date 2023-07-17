import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const CSVParser = () => {
  const [csvData, setCSVData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [namePairs, setNamePairs] = useState([]);
  const [filteredFirstNames, setFilteredFirstNames] = useState([]);
  const [filteredLastNames, setFilteredLastNames] = useState([]);
  const [teamOptionsList, setTeamOptionsList] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [firstNames, setFirstNames] = useState([]);
  const [lastNames, setLastNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [parseAttempts, setParseAttempts] = useState(0); // Counter for parse attempts

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (csvData.length === 0) {
        // Download the CSV file only if it hasn't been loaded before
        try {
          const response = await fetch(`players.csv`);
          const reader = response.body.getReader();
          const result = await reader.read();
          const decoder = new TextDecoder('utf-8');
          const csvString = decoder.decode(result.value);
          const { data } = Papa.parse(csvString, { header: true });

          const firstNamesSet = new Set();
          const lastNamesSet = new Set();
          const namePairs = [];
          const teamsSet = new Set();

          for (const row of data) {
            firstNamesSet.add(row.FIRST_NAME);
            lastNamesSet.add(row.LAST_NAME);
            namePairs.push({ firstName: row.FIRST_NAME, lastName: row.LAST_NAME });

            if (row.TEAMS) {
              const teams = row.TEAMS.split(',').map((team) => team.trim());
              teams.forEach((team) => teamsSet.add(team));
            }
          }

          const firstNames = Array.from(firstNamesSet);
          const lastNames = Array.from(lastNamesSet);
          const teamOptionsList = Array.from(teamsSet).sort();

          if (teamOptionsList.length !== 58) {
            console.log('Incorrect number of teams. Re-parsing data...');
            setParseAttempts((prevAttempts) => prevAttempts + 1); // Increment parse attempts
          } else {
            setFirstNames(firstNames);
            setLastNames(lastNames);
            setNamePairs(namePairs);
            setTeamOptionsList(teamOptionsList);
            setCSVData(data);
            setFilteredData([]); // Reset filteredData to empty array
            setParseAttempts(0); // Reset parse attempts counter
          }
        } catch (error) {
          console.error('Failed to fetch CSV data:', error);
        }
      }

      setIsLoading(false);
    };

    fetchData();
  }, [csvData, parseAttempts]);

  const handleFirstNameChange = (event) => {
    const firstName = event.target.value.trim().toLowerCase();
    setFirstName(firstName);
    const filteredFirstNames = firstNames.filter((name) =>
      name.toLowerCase().startsWith(firstName)
    );
    setFilteredFirstNames(filteredFirstNames);

    const filteredResult = csvData.filter((row) =>
      row.FIRST_NAME.toLowerCase().startsWith(firstName)
    );
    setFilteredData(filteredResult);
  };

  const handleLastNameChange = (event) => {
    const lastName = event.target.value.trim().toLowerCase();
    const filteredLastNames = namePairs
      .filter(
        (namePair) =>
          namePair.firstName.toLowerCase() === firstName.toLowerCase()
      )
      .map((namePair) => namePair.lastName)
      .filter((name) => name.toLowerCase().startsWith(lastName));
    setFilteredLastNames(filteredLastNames);

    const filteredResult = csvData.filter(
      (row) =>
        row.FIRST_NAME.toLowerCase() === firstName.toLowerCase() &&
        row.LAST_NAME.toLowerCase().startsWith(lastName)
    );
    setFilteredData(filteredResult);
  };

  useEffect(() => {
    const filteredResult =
      selectedTeams.length > 0
        ? csvData.filter((row) => {
            const teamNames = selectedTeams.map((team) => team.toLowerCase());
            const playerTeams = row.TEAMS
              ? row.TEAMS.toLowerCase().split(/,\s*/)
              : [];
            return teamNames.every((team) => playerTeams.includes(team));
          })
        : []; // Set filteredResult as empty array when no teams are selected
    setFilteredData(filteredResult);
  }, [csvData, selectedTeams]);

  const handleTeamSelection = (event) => {
    const selectedTeam = event.target.value;
    if (event.target.checked) {
      setSelectedTeams((prevSelectedTeams) => [
        ...prevSelectedTeams,
        selectedTeam,
      ]);
    } else {
      setSelectedTeams((prevSelectedTeams) =>
        prevSelectedTeams.filter((team) => team !== selectedTeam)
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Player Team Search</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-2">Filter by Player Name</h2>
          <form className="mb-4">
            <div className="flex flex-col sm:flex-row">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="px-4 py-2 border rounded mb-2 sm:mb-0 sm:mr-2"
                list="firstNamesList"
                onChange={handleFirstNameChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="px-4 py-2 border rounded"
                list="lastNamesList"
                onChange={handleLastNameChange}
              />
            </div>
            <datalist id="firstNamesList">
              {filteredFirstNames.map((name, index) => (
                <option key={index} value={name} />
              ))}
            </datalist>
            <datalist id="lastNamesList">
              {filteredLastNames.map((name, index) => (
                <option key={index} value={name} />
              ))}
            </datalist>
          </form>

          <h2 className="text-2xl font-bold mb-2">Filter by Team Name</h2>
          <div className="flex flex-wrap">
            {teamOptionsList.map((team, index) => (
              <label key={index} className="flex items-center mr-4 mb-2">
                <input
                  type="checkbox"
                  name="team"
                  value={team}
                  className="mr-2"
                  onChange={handleTeamSelection}
                />
                {team}
              </label>
            ))}
          </div>

          {(selectedTeams.length > 0 || firstName || filteredData.length > 0) ? (
            <div>
              <h2 className="text-2xl font-bold mb-2">Filtered Results:</h2>
              <ul className="list-disc ml-8">
                {filteredData.map((row, index) => (
                  <li key={index}>
                    {`${row.FIRST_NAME} ${row.LAST_NAME} - ${row.TEAMS}`}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default CSVParser;