# Resort CRM – Frontend Application

A modern, responsive React-based frontend application for managing resort operations. This system provides a comprehensive interface for managing rooms, guests, and allotments within a resort management system.

## Tech Stack

- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.0.10
- **HTTP Client**: Axios 1.6.2
- **JavaScript Version**: ES Modules
- **Styling**: CSS

## Project Structure

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

## What Does This Frontend Do?

This Resort CRM frontend is a complete management dashboard for resort operations. It provides staff and managers with an intuitive interface to:

- **Manage Rooms**: View, organize, and track the status of all resort rooms
- **Handle Guests**: Maintain guest profiles, track check-ins/check-outs, and manage reservations
- **Control Allotments**: Manage room availability, allocations, and inventory across different booking channels
- **Real-time Updates**: Get live updates on room status and guest information through API integration
- **Responsive UI**: Access the system from desktop and mobile devices with a modern, user-friendly interface

The frontend communicates seamlessly with the backend API to ensure data consistency and provide a smooth operational workflow for resort staff.

## Features

- **Room Management** - View and manage resort rooms with loading states
- **Guest Management** - Handle guest information and bookings
- **Allotment Management** - Manage room allotments and availability
- **API Integration** - Seamless communication with backend services via Axios

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

Build for production:

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## API Integration

The application communicates with the backend through the `api.js` service module using Axios. Configure your API endpoints in the services layer before deploying to production.

## Backend Dependency

This frontend application depends on a Spring Boot backend service that provides REST APIs for managing guests, rooms, and allotments.

For full functionality, the backend service must be running and accessible via a public API URL. The frontend communicates with the backend using environment-based configuration.

Without the backend service, the UI will load but data operations will not function.

## Environment Configuration

The backend API base URL is configured using environment variables to support different environments such as local development and production deployment.

Example environment variable:

```env
VITE_API_BASE_URL=https://<backend-url>
```

## Deployment

This application is deployed on Vercel and is live at:

🌐 **[https://resort-crm-by-dk.vercel.app](https://resort-crm-by-dk.vercel.app)**

The application is automatically deployed from the main branch and benefits from Vercel's global CDN for optimal performance.

## Known Limitations

- The frontend requires an active backend service to perform CRUD operations.
- Backend availability may affect real-time data updates.
- Authentication and role-based access control are not implemented in the current version.

## Quality Assurance

SonarQube configuration is included via `sonar-project.properties` for code quality analysis.

## License

Private - Resort CRM System
