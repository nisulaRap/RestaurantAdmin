# Restaurant Admin Panel

A full-stack restaurant administration and management platform built with the **MERN** stack (MongoDB, Express, React, Node.js), powered by **Vite** and containerized with **Docker**.

---

## Features

- **Dashboard Analytics**: Real-time sales, order trends and metrics visualized using [Recharts](https://recharts.org/).
- **Restaurant Management**: Register, view, update and manage restaurant branches and details.
- **Menu Management**: Add, update and remove menu items with image uploads (via Multer).
- **Order Management**: Monitor order states (`Pending`, `Confirmed`, `Preparing`, `ReadyToDeliver`, `Cancelled`).
- **Automated Email Notifications**: Sends automated email updates to customers upon order status changes using Nodemailer.
- **PDF Report Generation**: Download detailed analytical reports generated on the server using PDFKit and ChartJS.
- **Authentication & Authorization**: Secure JWT authentication and role-based permissions (`RestaurantAdmin`, `Customer`).

---

## System Architecture

This project is built using a **Decoupled Client-Server Architecture** featuring a **Monolithic Backend API** and an independent **Single Page Application (SPA) Frontend**:

```
 ┌─────────────────────────────────────────────────────────┐
 │                   Frontend (Client)                     │
 │                 React 19 + Vite (SPA)                   │
 │                 http://localhost:5173                   │
 └────────────────────────────┬────────────────────────────┘
                              │
                              │ REST API Calls (JSON / HTTP)
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │               Backend (Monolithic API)                  │
 │               Express.js / Node.js Runtime              │
 │                 http://localhost:7001                   │
 │ ┌───────────────────┬───────────────────┬─────────────┐ │
 │ │ Auth & Users      │ Restaurants       │ Menu Items  │ │
 │ ├───────────────────┼───────────────────┼─────────────┤ │
 │ │ Orders Management │ Dashboard Metrics │ PDF Reports │ │
 │ ├───────────────────┴───────────────────┴─────────────┤ │
 │ │ Background Services & Cron Notifications            │ │
 │ └─────────────────────────────────────────────────────┘ │
 └────────────────────────────┬────────────────────────────┘
                              │
                              │ Mongoose ODM (Unified Connection)
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │                  Database Layer                         │
 │             MongoDB (Atlas / Local Instance)            │
 └─────────────────────────────────────────────────────────┘
```

### Key Architectural Characteristics

1. **Monolithic Backend API**:
   - **Unified Deployment & Runtime**: All business domains (`Users`, `Restaurants`, `Menus`, `Orders`, `Dashboard Analytics`, `PDF Reports` and `Email Crons`) reside in a single codebase and execute within a single Node.js process ([server.js](file:///d:/My_Files/Projects/RestaurantAdmin/Backend/server.js)).
   - **Shared Database**: All models operate against a centralized MongoDB database instance using Mongoose schemas.
   - **In-Process Communication**: Inter-module logic (e.g. order status changes triggering email notifications via Nodemailer) runs in-memory with zero network latency or message broker overhead.

2. **Decoupled Frontend (SPA)**:
   - Built as an independent Single Page Application with React 19 and Vite.
   - Communicates with the backend exclusively through asynchronous RESTful HTTP endpoints.
   - Maintains client-side state and token-based authentication via `AuthContext` and `localStorage`.

3. **Monorepo Containerization**:
   - Both Frontend and Backend codebases are managed within a single repository.
   - Dockerized independently with dedicated `Dockerfile` specifications and orchestrated together using [docker-compose.yml](file:///d:/My_Files/Projects/RestaurantAdmin/docker-compose.yml).

---

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM (v7)
- **State & Context**: React Context API (`AuthContext`)
- **HTTP Client**: Axios
- **UI & Icons**: FontAwesome & React Icons
- **Data Visualization**: Recharts
- **Notifications**: React Toastify

### Backend
- **Runtime**: Node.js & Express
- **Database**: MongoDB with Mongoose ODM
- **File Uploads**: Multer
- **Authentication**: JSON Web Token (JWT) & bcrypt
- **Reporting**: PDFKit & Chart.js Node Canvas
- **Mailing**: Nodemailer

### DevOps & Deployment
- Docker & Docker Compose

---

## Project Structure

```text
RestaurantAdmin/
├── Backend/
│   ├── assets/             # Brand and report assets
│   ├── Controllers/        # Business logic for routes
│   │   ├── dashboardController.js
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   ├── reportController.js
│   │   ├── restaurantController.js
│   │   └── userController.js
│   ├── Cron/               # Email status triggers
│   ├── Middleware/         # Auth token & file upload middlewares
│   ├── Models/             # Mongoose schemas (User, Restaurant, Menu, Order)
│   ├── reports/            # Generated PDF reports
│   ├── Routes/             # Express API route handlers
│   ├── services/           # Email service helper
│   ├── uploads/            # Uploaded dish and restaurant images
│   ├── .env.example        # Sample environment configuration
│   ├── Dockerfile          # Backend container file
│   ├── package.json
│   └── server.js           # Express app entry point (port 7001)
├── Frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── assets/         # App icons and imagery
│   │   ├── Components/     # Header, Sidebar, Footer, Context
│   │   ├── Pages/          # Dashboard, Menu, Restaurant, Orders, Login
│   │   ├── App.jsx         # App routes and layout
│   │   ├── index.css       # Global styles
│   │   └── main.jsx        # React root entry
│   ├── Dockerfile          # Frontend container file
│   ├── package.json
│   └── vite.config.js      # Vite configuration (port 5173)
├── docker-compose.yml      # Orchestrates backend & frontend
├── .gitignore              # Root git ignore rules
└── README.md
```

---

## Prerequisites

Before running the application, make sure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection URI)
- *(Optional)* [Docker Desktop](https://www.docker.com/) for containerized execution

---

## Environment Variables

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Update the values in `.env`:
   ```ini
   CONNECTION_STRING=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL=your-email@gmail.com
   EMAIL_PASSWORD=your-app-specific-password
   ```

---

## Getting Started

### Option 1: Local Development (Node.js)

Run the backend and frontend in separate terminals:

#### 1. Start the Backend
```bash
cd Backend
npm install
npm start
```
> The backend server starts at **`http://localhost:7001`**.

#### 2. Start the Frontend
```bash
cd Frontend
npm install
npm run dev
```
> The frontend application starts at **`http://localhost:5173`**.

---

### Option 2: Docker Compose

You can build and start both the backend and frontend simultaneously with Docker:

```bash
docker-compose up --build
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:7001](http://localhost:7001)

To stop the containers:
```bash
docker-compose down
```

---

## API Endpoints

| Route Prefix | Description | Key Operations |
|---|---|---|
| `/api/users` | Authentication & User Management | Register, Login, Verify token |
| `/api/restaurant` | Restaurant Operations | Create, list, fetch, update, delete |
| `/api/menu` | Menu & Dish Operations | Add item (with image), list, update, delete |
| `/api/order` | Orders Management | Fetch orders, update order status |
| `/api/dashboard` | Dashboard Metrics | Sales counts, income, recent orders |
| `/api/report` | Reports & Export | Generate & download PDF report, email report |
| `/images` | Static Uploads | Serves uploaded restaurant & menu images |

