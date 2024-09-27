# Constellr STAC API search

This application empowers users to explore Landsat data, providing an intuitive interface for search, visualization, and detailed inspection of geospatial information.

## Getting Started

These instructions will help you set up the project on your local machine.

### Prerequisites

Make sure you have the following installed:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Fill the `.env` with the variables
```
PORT=5000
STAC_API_URL=https://landsatlook.usgs.gov/stac-server
FRONTEND_URL=http://localhost:3000
```

3. Run the command
```
docker-compose up --build
```

4. The application should now be running with the following URLs
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

5. Go to `http://localhost:3000` to view the webpage.