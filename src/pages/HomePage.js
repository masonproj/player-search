import React from 'react';
import '../styles/CSVParser.css';
import CSVParser from './CSVParser';
import BugAlert from './BugAlert';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-0 py-8">
      <BugAlert />
      <CSVParser />
    </div>
  );
};

export default HomePage;
