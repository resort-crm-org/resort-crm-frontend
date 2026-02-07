# Resort CRM – Frontend Application

## Overview

A modern, responsive React-based frontend application for managing resort operations. This system provides a comprehensive interface for managing rooms, guests, and allotments within a resort management system.

This Resort CRM frontend is a complete management dashboard for resort operations. It provides staff and managers with an intuitive interface to:

- **Manage Rooms**: View, organize, and track the status of all resort rooms
- **Handle Guests**: Maintain guest profiles, track check-ins/check-outs, and manage reservations
- **Control Allotments**: Manage room availability, allocations, and inventory across different booking channels
- **Real-time Updates**: Get live updates on room status and guest information through API integration
- **Responsive UI**: Access the system from desktop and mobile devices with a modern, user-friendly interface

### Tech Stack

- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.0.10
- **HTTP Client**: Axios 1.6.2
- **JavaScript Version**: ES Modules
- **Styling**: CSS

### Project Structure

```
src/
├── components/
│   └── RoomSpinner.jsx          # Loading spinner component for rooms
├── pages/
│   ├── AllotmentPage.jsx        # Allotment management page
│   ├── GuestsPage.jsx           # Guest management page
│   └── RoomsPage.jsx            # Room management page
├── services/
│   └── api.js                   # API service module for backend communication
├── App.jsx                      # Main application component
├── main.jsx                     # Application entry point
└── styles.css                   # Global styles
```

### Features

- **Room Management** - View and manage resort rooms with loading states
- **Guest Management** - Handle guest information and bookings
- **Allotment Management** - Manage room allotments and availability
- **API Integration** - Seamless communication with backend services via Axios

## Development Frontend

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### API Integration

The application communicates with the backend through the `api.js` service module using Axios. Configure your API endpoints in the services layer before deploying to production.

### Backend Dependency

This frontend application depends on a Spring Boot backend service that provides REST APIs for managing guests, rooms, and allotments.

For full functionality, the backend service must be running and accessible via a public API URL. The frontend communicates with the backend using environment-based configuration.

Without the backend service, the UI will load but data operations will not function.

### Environment Configuration

The backend API base URL is configured using environment variables to support different environments such as local development and production deployment.

Example environment variable:

```env
VITE_API_BASE_URL=https://<backend-url>
```

## Build Project Frontend

Build for production:

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

![Frontend Build Screenshot](Proof/Frontend%20Build.png)

## Sonar Frontend

SonarQube configuration is included via `sonar-project.properties` for code quality analysis.

The project includes comprehensive quality assurance settings to ensure code quality and maintainability standards are met.

![Sonar Frontend Screenshot](Proof/Sonar%20Frontend.png)

## Project Pull Request

For contributing to this project, please follow the standard Git workflow:

1. Create a feature branch from `main`
2. Make your changes and commit with clear messages
3. Push to your branch
4. Create a Pull Request with detailed description
5. Ensure all CI/CD checks pass

![Pull Request Screenshot](Proof/PR.png)

## Vercel Deployment

This application is deployed on Vercel and is live at:

🌐 **[https://resort-crm-frontend.vercel.app/](https://resort-crm-by-dk.vercel.app)**

The application is automatically deployed from the main branch and benefits from Vercel's global CDN for optimal performance.

![Frontend Deployment Screenshot](Proof/Frontend%20deployed.png)

## Vercel Deployment with Custom Domain

The application is also accessible through a custom domain:

🌐 **[https://www.dkportfolio.me](https://www.dkportfolio.me)**

The application can be configured with a custom domain through Vercel's domain settings. Connect your custom domain in the Vercel project settings to use a branded URL instead of the default vercel.app domain.

![Custom Domain Configuration Screenshot](Proof/Github%20Custom%20Domain.png)

## Project Demo

 **[View Demo Video](https://drive.google.com/file/d/1NJtjuqoe826sL0LhYJCs43jDAbEGi1h-/view?usp=sharing)**

## Presentation in English

Presentation slides and documentation:

📄 **[View Presentation (PPTX)](Proof/Resort%20CRM%20Presentation.pptx)**

## Challenges Faced and Solutions Implemented

During development and deployment, several integration and configuration challenges were encountered:

### Challenge 1: Backend API Connectivity
- **Issue**: Establishing reliable communication between frontend and backend API
- **Solution**: Implemented environment-based configuration for API URLs to support different deployment environments (local, staging, production)

### Challenge 2: Environment Configuration
- **Issue**: Managing different API endpoints across development and production environments
- **Solution**: Utilized Vite's environment variables system with `.env.local` and `.env.production` files

### Challenge 3: Build Optimization
- **Issue**: Optimizing build size and performance for Vercel deployment
- **Solution**: Configured Vite with proper plugin settings and tree-shaking to minimize bundle size

### Challenge 4: CORS and Backend Dependency
- **Issue**: Frontend requires active backend service for data operations
- **Solution**: Implemented proper error handling and user feedback when backend is unavailable

These challenges were resolved through iterative development, proper testing, and close coordination with the backend team.

## Known Limitations

- The frontend requires an active backend service to perform CRUD operations.
- Backend availability may affect real-time data updates.
- Authentication and role-based access control are not implemented in the current version.

---

**Last Updated: February 7, 2026**

