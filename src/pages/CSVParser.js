import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const CSVParser = () => {
  const [csvData, setCSVData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [namePairs, setNamePairs] = useState([]);
  const [filteredFirstNames, setFilteredFirstNames] = useState([]);
  const [filteredLastNames, setFilteredLastNames] = useState([]);
  const [teamOptionsList, setTeamOptionsList] = useState([
    'Washington Capitals',
    'Dallas Stars',
    'Buffalo Sabres',
    'Toronto St. Patricks',
    'Toronto Maple Leafs',
    'Hartford Whalers',
    'Los Angeles Kings',
    'New York Americans',
    'Florida Panthers',
    'Minnesota North Stars',
    'Winnipeg Jets (1979)',
    'Detroit Cougars',
    'Anaheim Ducks',
    'Philadelphia Flyers',
    'Cleveland Barons',
    'Pittsburgh Penguins',
    'Detroit Falcons',
    'St. Louis Blues',
    'California Golden Seals',
    'Kansas City Scouts',
    'New Jersey Devils',
    'Philadelphia Quakers',
    'Hamilton Tigers',
    'Colorado Avalanche',
    'Carolina Hurricanes',
    'Minnesota Wild',
    'Arizona Coyotes',
    'New York Rangers',
    'Brooklyn Americans',
    'Boston Bruins',
    'Edmonton Oilers',
    'Detroit Red Wings',
    'Atlanta Thrashers',
    'Quebec Bulldogs',
    'Vegas Golden Knights',
    'Vancouver Canucks',
    'Colorado Rockies',
    'Toronto Arenas',
    'Oakland Seals',
    'Nashville Predators',
    'Montréal Canadiens',
    'Phoenix Coyotes',
    'Montreal Maroons',
    'Chicago Blackhawks',
    'Ottawa Senators (1917)',
    'Quebec Nordiques',
    'Columbus Blue Jackets',
    'Winnipeg Jets',
    'Montreal Wanderers',
    'St. Louis Eagles',
    'Ottawa Senators',
    'Seattle Kraken',
    'Calgary Flames',
    'Atlanta Flames',
    'San Jose Sharks',
    'Pittsburgh Pirates',
    'Tampa Bay Lightning',
    'New York Islanders',
  ]);
  const [firstName, setFirstName] = useState('');
  const [firstNames, setFirstNames] = useState([]);
  const [lastNames, setLastNames] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('player-search/players.csv');
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

      setFirstNames(firstNames);
      setLastNames(lastNames);
      setNamePairs(namePairs);
      setCSVData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      // Handle the error state here (e.g., display an error message)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFirstNameChange = (event) => {
    const firstName = event.target.value.trim().toLowerCase();
    setFirstName(firstName);
    const filteredFirstNames = firstNames.filter((name) =>
      name.toLowerCase().startsWith(firstName)
    );
    setFilteredFirstNames(filteredFirstNames);
  };

  const handleLastNameChange = (event) => {
    const lastName = event.target.value.trim().toLowerCase();
    const filteredLastNames = namePairs
      .filter((namePair) => namePair.firstName.toLowerCase() === firstName.toLowerCase())
      .map((namePair) => namePair.lastName)
      .filter((name) => name.toLowerCase().startsWith(lastName));
    setFilteredLastNames(filteredLastNames);
  };

  const handleFilterByPlayer = (event) => {
    event.preventDefault();
    const firstName = event.target.firstName.value.trim();
    const lastName = event.target.lastName.value.trim();

    const filteredResult = csvData.filter(
      (row) =>
        row.FIRST_NAME.toLowerCase() === firstName.toLowerCase() &&
        row.LAST_NAME.toLowerCase() === lastName.toLowerCase()
    );
    setFilteredData(filteredResult);
  };

  const handleFilterByTeam = (event) => {
    event.preventDefault();
    if (selectedTeams.length === 0) {
      setFilteredData([]);
      return;
    }
    const filteredResult = csvData.filter((row) => {
      const teamNames = selectedTeams.map((team) => team.toLowerCase());
      const playerTeams = row.TEAMS ? row.TEAMS.toLowerCase().split(/,\s*/) : [];
      return teamNames.every((team) => playerTeams.includes(team));
    });
    setFilteredData(filteredResult);
  };

  const handleTeamSelection = (event) => {
    const selectedTeam = event.target.value;
    if (event.target.checked) {
      setSelectedTeams((prevSelectedTeams) => [...prevSelectedTeams, selectedTeam]);
    } else {
      setSelectedTeams((prevSelectedTeams) =>
        prevSelectedTeams.filter((team) => team !== selectedTeam)
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Player Team Search</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-2">Filter by Player Name</h2>
          <form onSubmit={handleFilterByPlayer} className="mb-4">
            <div className="flex">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="px-4 py-2 border rounded-l"
                list="firstNamesList"
                onChange={handleFirstNameChange}
              />
              <datalist id="firstNamesList">
                {filteredFirstNames.map((name, index) => (
                  <option key={index} value={name} />
                ))}
              </datalist>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="px-4 py-2 border rounded-r"
                list="lastNamesList"
                onChange={handleLastNameChange}
              />
              <datalist id="lastNamesList">
                {filteredLastNames.map((name, index) => (
                  <option key={index} value={name} />
                ))}
              </datalist>
              <button
                type="submit"
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Filter
              </button>
            </div>
          </form>

          <h2 className="text-2xl font-bold mb-2">Filter by Team Name</h2>
          {teamOptionsList.length > 0 ? (
            <form onSubmit={handleFilterByTeam} className="mb-4">
              <div className="flex flex-wrap">
                {teamOptionsList.map((team, index) => (
                  <div key={index} className="mr-4 mb-2">
                    <input
                      type="checkbox"
                      id={team}
                      value={team}
                      onChange={handleTeamSelection}
                      className="mr-2"
                    />
                    <label htmlFor={team}>{team}</label>
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Filter
              </button>
            </form>
          ) : (
            <p>No teams available</p>
          )}

          {filteredData.length > 0 && (
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
          )}
        </>
      )}
    </div>
  );
};

export default CSVParser;
