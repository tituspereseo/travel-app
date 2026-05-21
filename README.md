# TravelGo - Travel Booking System 
 
##Overview 
 
A full-stack travel booking system built with Spring Boot backend and React frontend, using PostgreSQL for database management. 
 
##Features 
 
- User Authentication (Login/Register) 
- Tour Booking Management 
- Payment Processing 
- Activity Logging 
- Client Dashboard 
- Admin Panel 
 
##Tech Stack 
 
**Backend:** 
- Java Spring Boot 
- Maven 
 
**Frontend:** 
- React.js 
- CSS3 
 
**Database:** 
- PostgreSQL 
- pgAdmin 4 
 
##How to Run This Project 
 
### Prerequisites 
- Java 11+ 
- Node.js and npm 
- PostgreSQL installed 
 
### Backend Setup 
1. Navigate to backend folder: `cd backend` 
2. Run the Spring Boot application: `./mvnw spring-boot:run` 
 
### Frontend Setup 
1. Navigate to client folder: `cd client` 
2. Install dependencies: `npm install` 
3. Start the React app: `npm start` 
 
### Database Setup 
1. Create a PostgreSQL database named `travelgo_db` 
2. Run the `database/migration.sql` file in pgAdmin 4 to create tables 
3. Update `backend/src/main/resources/application.properties` with your database credentials 
 
##Project Structure 
 
``` 
travel-app/ 
ÃÄÄ backend/         # Spring Boot backend 
ÃÄÄ client/          # React frontend 
ÃÄÄ database/        # SQL migration files 
ÀÄÄ README.md        # This file 
``` 
 
##Author 
 
**Titus** 
 
GitHub: [tituspereseo](https://github.com/tituspereseo) 
