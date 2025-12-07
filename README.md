# Virtual Birthday Celebration App 🎂

A festive, interactive web application to celebrate birthdays virtually!

## Features
- **Customizable Celebration**: Enter the recipient's name, a message, and choose a cake flavor.
- **Interactive Cake**: Blow out the candles (audio detection) and cut the cake.
- **Party Mode**: Confetti, music, and a festive atmosphere.
- **Birthday Wishes**: Friends can leave wishes via a shared link.
- **Sticky Notes Wall**: Wishes are displayed as a wall of colorful sticky notes.
- **PostgreSQL Integration**: Robust data storage with automatic fallback to `localStorage`.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, PostgreSQL
- **Tools**: Vite, Canvas Confetti

## Getting Started

### Prerequisites
- Node.js installed
- (Optional) PostgreSQL installed and running

### Installation
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    -   Copy `.env.example` to `.env` (Frontend)
    -   Copy `server/.env.example` to `server/.env` (Backend)

### Running the App
1.  Start the frontend:
    ```bash
    npm run dev
    ```
2.  (Optional) Start the backend:
    ```bash
    node server/index.js
    ```

## Deployment
See `deployment_plan.md` for detailed instructions.
