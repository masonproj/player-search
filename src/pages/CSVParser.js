import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import PlayerFilters from './PlayerFilters';

const CSVParser = () => {
  const [csvData, setCSVData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (csvData.length === 0) {
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
    <>
      <h1 className="text-3xl font-bold mb-4 text-center">Player Team Search</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      ) : (
        <PlayerFilters csvData={csvData} setCSVData={setCSVData} />
      )}
    </>
  );
};

export default CSVParser;
