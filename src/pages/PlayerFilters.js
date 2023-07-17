import React, { useState, useEffect } from 'react';
import Table from '../components/Table';

const PlayerFilters = ({ csvData, setCSVData }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [firstNames, setFirstNames] = useState([]);
  const [lastNames, setLastNames] = useState([]);
  const [filteredFirstNames, setFilteredFirstNames] = useState([]);
  const [filteredLastNames, setFilteredLastNames] = useState([]);
  const [teamOptionsList, setTeamOptionsList] = useState([]);
  const [namePairs, setNamePairs] = useState([]);

  useEffect(() => {
	const firstNamesSet = new Set();
	const lastNamesSet = new Set();
	const namePairs = [];
	const teamsSet = new Set();
  
	for (const row of csvData) {
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
  
	setFirstNames(firstNames);
	setLastNames(lastNames);
	setNamePairs(namePairs);
	setTeamOptionsList(teamOptionsList);
	setFilteredData([]);
  
	// If there aren't 58 teams, fetch the CSV data again
	if (teamOptionsList.length !== 58) {
	  setCSVData([]);
	}
  }, [csvData, setCSVData]);
  

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
    <div>
      <h2 className="text-2xl font-bold mb-2">Filter by Player Name</h2>
      <form className="mb-4">
        <div className="flex flex-col sm:flex-row">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="px-4 py-2 border rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
            list="firstNamesList"
            onChange={handleFirstNameChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="px-4 py-2 border rounded w-full sm:w-auto"
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

      {filteredData.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">Filtered Results:</h2>
          <Table
            columns={[
              { Header: 'First Name', accessor: 'FIRST_NAME' },
              { Header: 'Last Name', accessor: 'LAST_NAME' },
              { Header: 'Teams', accessor: 'TEAMS' },
            ]}
            data={filteredData}
          />
        </div>
      )}
    </div>
  );
};

export default PlayerFilters;
