import React from 'react';
import CSVParser from '../pages/CSVParser';
import BugAlert from './BugAlert';

const HomePage = () => {
  return (
    <div>
      <BugAlert />
      <CSVParser />
    </div>
  );
};

export default HomePage;
