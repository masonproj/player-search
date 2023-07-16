# Player Search

Player Search is a web application built with GatsbyJS that allows users to search for hockey players based on their first name, last name, or teams they have played for. The application utilizes a CSV file containing player data to provide search functionality and autofill suggestions.

The idea for this project was inspired by the requests from members of the hockey community on Reddit, particularly Puckdoku players.

## Installation

1. Clone the repository: `git clone https://github.com/your-username/player-search.git`
2. Navigate to the project directory: `cd player-search`
3. Install dependencies: `npm install`

## Usage

1. Place your CSV file containing player data in the `static` folder.
2. Start the development server: `npm run develop`
3. Open your browser and navigate to `http://localhost:8000` to access the Player Search application.

## Features

- CSV last generated July 14, 2023
- Search by first name, last name, or teams played for.
- Autofill suggestions based on user input.
- Filtered search results displayed in a table.

## Project Structure

- `src/components`: Contains the reusable components used in the application.
- `src/pages`: Contains the main pages of the application.
- `static`: The folder where you can place your CSV file.

## Dependencies

The project utilizes the following main dependencies:

- Gatsby: Static site generator for building fast, optimized websites.
- Papa Parse: CSV parsing library for parsing the player data.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
