import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useTable, useSortBy, usePagination } from 'react-table';
import './../styles/CSVParser.css';

const CSVParser = () => {
  const [csvData, setCSVData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

          setCSVData(data);
        } catch (error) {
          console.error('Failed to fetch CSV data:', error);
        }
      }

      setIsLoading(false);
    };

    fetchData();
  }, [csvData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Player Team Search</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      ) : (
        <PlayerFilters csvData={csvData} setCSVData={setCSVData} />
      )}
    </div>
  );
};

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
  }, [csvData]);

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

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }, // Set the page size (number of items per page)
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="table-container">
      <table {...getTableProps()} className="player-table">
        {/* Table header */}
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* Table body */}
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
      </div>
    </div>
  );
};

export default CSVParser;
