[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mNaxAqQD)

# REST Countries App

A React-based frontend application that consumes the REST Countries API to display country information, including name, capital, region, population, flag, and languages. The app supports searching by name, filtering by region, viewing detailed country information, user authentication, and managing favorite countries. It is styled with Tailwind CSS, tested with Jest and React Testing Library, and deployed on Vercel.

https://rest-countries-app-xyz.vercel.app

## Features

- **Country List**: Displays a grid of countries with key details fetched from the `/all` endpoint.
- **Search and Filter**: Search countries by name (`/name/{name}`) and filter by region (`/region/{region}`).
- **Country Details**: View detailed information for a country using the `/alpha/{code}` endpoint.
- **User Authentication**: Simple login system using local storage for session management.
- **Favorites**: Logged-in users can add/remove countries to a favorites list, stored in local storage.
- **Responsive Design**: Tailwind CSS ensures a modern, responsive UI across devices.
- **Testing**: Unit and integration tests cover components and API integration.
- **Deployment**: Hosted on Vercel for public access.

## Technologies

- **Frontend**: React (functional components), React Router, Axios
- **Styling**: Tailwind CSS
- **Testing**: Jest, React Testing Library
- **Version Control**: Git, GitHub
- **Deployment**: Vercel
- **API**: REST Countries API (https://restcountries.com/)

## Setup Instructions

1. **Prerequisites**:
   - Node.js (v18 or later)
   - Git
2. **Clone the Repository**:
   ```bash
   git clone <your-github-repo-url>
   cd rest-countries-app
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

- Open http://localhost:5173 in your browser.

5. **Run Tests:**:
   ```bash
   npm run test
   ```
6. **Build for Production**:
   ```bash
   npm run build
   ```

## Deployment

- The application is deployed on Vercel. Access it at:
  [https://rest-countries-app-xyz.vercel.app]

## Project Structure

```plain
src/
├── assets/             # Static assets
├── components/         # Reusable components (e.g., Header, CountryCard)
├── context/            # AuthContext for user state
├── pages/              # Page components (Home, CountryDetails, etc.)
├── services/           # API service layer
├── styles/             # Additional CSS (if any)
├── App.jsx             # Main app with routing
├── index.css           # Tailwind CSS
├── main.jsx            # Entry point
```

## Credits

- Built for SE3040 – Application Frameworks, SLIIT, 2025.
- REST Countries API: https://restcountries.com/
- Tailwind CSS: https://tailwindcss.com/
- React: https://reactjs.org/
