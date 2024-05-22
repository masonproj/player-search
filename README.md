# Player Search

Player Search is a web application built with GatsbyJS and React that allows users to search for hockey players based on their first name, last name, or teams they have played for. The application utilizes a CSV file containing player data to provide search functionality, autofill suggestions, and sorting and pagination of search results.

The idea for this project was inspired by the requests from members of the hockey community on Reddit, particularly Puckdoku players.

## Installation

1. Clone the repository: `git clone https://github.com/masonproj/player-search.git`
2. Navigate to the project directory: `cd player-search`
3. Install dependencies: `npm install`

## Usage

1. Place your CSV file containing player data in the `static` folder.
2. Start the development server: `npm run develop`
3. Open your browser and navigate to `http://localhost:8000` to access the Player Search application.

## Features

- CSV last generated July 15, 2023
- Search by first name, last name, or teams played for.
- Autofill suggestions based on user input.
- Filtered search results displayed in a table, with sorting and pagination functionalities.
- Team filter functionality with checkbox options.
- Loading state during the CSV data fetching and parsing process.
- Error handling for CSV data fetching and parsing.

## Project Structure

- `src/components`: Contains the reusable components used in the application.
- `src/pages`: Contains the main pages of the application.
- `src/pages/CSVParser.js`: Contains utility functions for parsing the CSV file and filtering the player data.
- `static`: The folder where you can place your CSV file.

## Dependencies

The project utilizes the following main dependencies:

- Gatsby: Static site generator for building fast, optimized websites.
- React: JavaScript library for building user interfaces.
- Papa Parse: CSV parsing library for parsing the player data.
- react-table: Library for building and managing tables in React.
- Fetch API: Web API for making HTTP requests, used here to fetch the CSV file.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
