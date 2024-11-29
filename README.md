# Court Booking App

### Deployed Link
https://dazzling-cassata-293316.netlify.app/


## Project Description
This project is a **court booking app** designed for a sports technology company's operations team. The app allows users to book courts, view available slots, and manage sports-related bookings. Admins or managers can also add, edit, or modify predefined time slots for each court. It is built using Node.js, Express.js for the backend, and MongoDB as the database for managing court, slot, and booking information.


## Table of Contents
- [Setup Instructions](#setup-instructions)
- [Run the Project](#run-the-project)
- [Deploy the Project](#deploy-the-project)
- [Prerequisites](#prerequisites)
- [Dependencies](#dependencies)
- [Assumptions and Limitations](#assumptions-and-limitations)
- [Special Instructions](#special-instructions)

## Setup Instructions

1. **Clone the repository**:
   First, clone the project repository to your local machine by running:
   ```bash
   git clone https://github.com/kundan211/court-booking-app.git
   cd Gametheory
   ```

2. **Install the required dependencies**:
   Make sure you have Node.js installed on your machine. Install the project dependencies by running:
   ```bash
   npm install
   ```

3. **Set up the database**:
   * Install and start MongoDB on your local machine
   * Update or create the `.env` file in the project's root directory with the following details:
     ```bash
     DB_URI
     PORT=5000
     ```
   * Initialize data (if required): If there are any database initialization scripts to set up collections or insert initial data (like predefined slots or sports), execute those scripts after setting up the MongoDB server

## Run the Project

1. **Start the backend server**:
   To run the Node.js server locally, execute:
   ```bash
   npm start
   ```
   This will start the server on `http://localhost:5000`.

2. **Access the application**:
   Once the server is running, you can access the application by navigating to `http://localhost:5000` in your browser.

## Deploy the Project

### Deploy on Render

1. **Create a Render account**:
   * Go to Render and create an account if you don't have one

2. **Create a new Web Service**:
   * In your Render dashboard, click on New > Web Service

3. **Connect to the repository**:
   * Select the repository (e.g., Gametheory) from GitHub when prompted

4. **Configure the environment**:
   * In the Environment tab, add your environment variables:
     ```makefile
     DB_URI=mongodb+srv://<your-production-mongo-uri>
     PORT=5000
     ```

5. **Choose a branch to deploy**:
   * Select the branch (e.g., main) you want to deploy

6. **Deploy**:
   * After setting up the service and environment, Render will automatically deploy your app
   * You can view your application at the URL provided by Render

7. **Post-deployment**:
   * Ensure that MongoDB is running in the cloud (for example, using MongoDB Atlas)
   * Set the DB_URI with the appropriate MongoDB connection string

### Troubleshooting
If you encounter any issues during deployment, check Render's deployment logs for errors and adjust configurations as needed.

## Prerequisites

Before running or deploying the project, ensure the following prerequisites are met:
* Node.js (v14+)
* npm (v6+)
* MongoDB (v4.0+)

## Dependencies

The project relies on several key dependencies. You can find these in package.json:
```json
{
  "express": "^4.17.1",
  "mongoose": "^5.13.3",
  "cors": "^2.8.5",
  "dotenv": "^8.2.0"
}
```
Install all dependencies by running:
```bash
npm install
```

## Assumptions and Limitations

### Assumptions:
* The admin or manager is responsible for managing court slots, including adding, modifying, and removing slots for bookings
* Only registered users can book courts, ensuring a controlled booking environment

### Limitations:
* The app does not include user authentication in its current state, meaning users are not required to log in before making bookings
* The app only supports bookings for a single sport at a time

## Special Instructions

* **Environment Variables**: Ensure that the `.env` file is properly set up with the MongoDB URI (`DB_URI`) and the server port (`PORT`)
* **MongoDB Setup**: Make sure MongoDB is installed and running locally for development purposes or use MongoDB Atlas for production
* **Testing**: The project does not include automated tests, so testing must be performed manually for now