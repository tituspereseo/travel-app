-- Create Database
CREATE DATABASE travelgo_db;

-- Connect to database
\c travelgo_db;

-- Create Users table
CREATE TABLE IF NOT EXISTS "Users" (
    id SERIAL PRIMARY KEY,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    "profileImage" TEXT,
    role VARCHAR(50) DEFAULT 'user',
    "isVerified" BOOLEAN DEFAULT FALSE,
    "verificationCode" VARCHAR(10),
    "resetCode" VARCHAR(10),
    status VARCHAR(20) DEFAULT 'active',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Tours table
CREATE TABLE IF NOT EXISTS "Tours" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    bookings INTEGER DEFAULT 0,
    rating DECIMAL(3,1) DEFAULT 0,
    image TEXT,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Bookings table
CREATE TABLE IF NOT EXISTS "Bookings" (
    id SERIAL PRIMARY KEY,
    "bookingNumber" VARCHAR(50) UNIQUE NOT NULL,
    "userId" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
    "tourId" INTEGER REFERENCES "Tours"(id) ON DELETE CASCADE,
    guests INTEGER DEFAULT 1,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "bookingDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "travelDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    "paymentStatus" VARCHAR(20) DEFAULT 'pending',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Payments table
CREATE TABLE IF NOT EXISTS "Payments" (
    id SERIAL PRIMARY KEY,
    "paymentNumber" VARCHAR(50) UNIQUE NOT NULL,
    "bookingId" INTEGER REFERENCES "Bookings"(id) ON DELETE CASCADE,
    "userId" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    "paymentMethod" VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    "transactionId" VARCHAR(255),
    "paymentDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create SystemUsers table
CREATE TABLE IF NOT EXISTS "SystemUsers" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    password VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Sample Tours
INSERT INTO "Tours" (name, location, duration, price, bookings, rating, image, description, status) VALUES
('Tokyo Explorer', 'Japan', '5 days', 57000, 128, 4.8, '/assets/images/tours/tokyo.jpg', 'Experience the vibrant culture and modern wonders of Tokyo.', 'active'),
('Paris Romance', 'France', '7 days', 104000, 95, 4.9, '/assets/images/tours/paris.jpg', 'Romantic getaway in the city of love and lights.', 'active'),
('Bali Retreat', 'Indonesia', '4 days', 42600, 156, 4.7, '/assets/images/tours/bali.jpg', 'Relax and rejuvenate in the paradise island of Bali.', 'active'),
('New York City Break', 'USA', '7 days', 88000, 77, 4.6, '/assets/images/tours/newyork.jpg', 'Explore the city that never sleeps.', 'active'),
('Cebu Island Hopping', 'Philippines', '6 days', 52000, 170, 4.9, '/assets/images/tours/cebu.jpg', 'Discover the beautiful islands of Cebu.', 'active'),
('Santorini Escape', 'Greece', '6 days', 85000, 62, 4.9, '/assets/images/tours/santorini.webp', 'Experience the stunning white-washed buildings and blue domes.', 'active');

-- Insert Sample System Users
INSERT INTO "SystemUsers" (name, email, role, status, password) VALUES
('Admin User', 'admin@travelandgo.com', 'Super Admin', 'active', '$2a$10$YourHashedPasswordHere'),
('John Manager', 'john@travelandgo.com', 'Manager', 'active', '$2a$10$YourHashedPasswordHere'),
('Admin Dave', 'jandave@gmail.com', 'Super Admin', 'active', '$2a$10$YourHashedPasswordHere');

-- Create Indexes
CREATE INDEX idx_users_email ON "Users"(email);
CREATE INDEX idx_bookings_userId ON "Bookings"("userId");
CREATE INDEX idx_bookings_tourId ON "Bookings"("tourId");
CREATE INDEX idx_payments_bookingId ON "Payments"("bookingId");
CREATE INDEX idx_tours_status ON "Tours"(status);