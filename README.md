# Multiplayer Maze Game

This project is a 2-player maze game built using **Three.js** for rendering the maze in 3D, and **Express.js** with **Socket.io** for real-time multiplayer functionality.

## Features

- **3D Maze Rendering**: The game is rendered using the Three.js library, providing an immersive 3D environment.
- **Multiplayer Support**: Two players can connect and compete to navigate the maze in real-time.
- **WebSocket Communication**: Uses Socket.io to handle real-time communication between players.
- **Multiple Difficulty Levels**: Players can choose between different maze difficulties (easy, medium, hard).

## Technologies Used

### Frontend
- **Three.js**: A powerful JavaScript library for 3D rendering in the browser.
- **JavaScript**: Handles client-side game logic and user controls.
  
### Backend
- **Express.js**: A minimal web framework for Node.js to handle the server.
- **Socket.io**: Enables real-time, bidirectional communication between players.
- **SQLite**: Stores data for different maze levels.

## Project Structure

- **ThreeJsBuild/**: Contains the Three.js build files for rendering the game.
- **server/**: Contains the Express.js backend code and database for maze levels.
  - `server.js`: The main server file handling the game logic and socket communication.
  - `package.json`: Lists the required dependencies for the backend.
  - `*.db`: Database files for different maze difficulty levels.

## Prerequisites

To run this project locally, ensure you have the following installed:

- **Node.js**: For managing the backend server.
- **npm**: Node package manager for handling dependencies.

## Installation

### 1. Clone the repository:

```bash
git clone <repository-url>
cd maze-game
```

### 2. Install backend dependencies:

Navigate to the `server` directory and install the required Node.js packages:

```bash
cd server
npm install
```

### 3. Run the backend server:

Start the Express server by running:

```bash
node server.js
```

The server will start on `http://localhost:3000`.

### 4. Start the game:

Open your browser and go to `http://localhost:3000` to launch the game.

## Gameplay

- **Objective**: The goal of the game is for both players to navigate the maze and reach the finish point first.
- **Real-time Multiplayer**: Players can move in real-time, and their positions will be updated for both players simultaneously using WebSockets.
- **Controls**: Use the WASD keys or arrow keys to navigate through the maze.

## Customization

You can extend this project by:

- Adding more maze levels or creating new difficulty settings by modifying the `.db` files in the `server` folder.
- Improving the UI/UX for a more polished gaming experience.
- Adding additional gameplay mechanics, such as timers or scoreboards.

## License

This project is open-source and available under the MIT License.

## Contributions

Contributions are welcome! Feel free to fork the repository and submit pull requests to improve the game or add new features.
