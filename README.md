# LA County HR Dashboard

Employee self-service portal for Los Angeles County staff.

## Features

- Employee dashboard with time-off management
- Request submission and tracking
- Company announcements
- Employee directory
- Profile management
- Admin reports (admin users only)

## Technologies

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Router

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone https://github.com/aalopez23/county-hr-dashboard.git

# Step 2: Navigate to the project directory
cd county-hr-dashboard

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run deploy` - Build and deploy to GitHub Pages

## Deployment

This project is configured for GitHub Pages deployment.

1. Build the project: `npm run build`
2. Deploy: `npm run deploy`
3. Configure GitHub Pages in your repository settings to use the `gh-pages` branch

The site will be available at: `https://aalopez23.github.io/county-hr-dashboard/`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (Auth, etc.)
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── pages/         # Page components
└── main.tsx       # Application entry point
```
