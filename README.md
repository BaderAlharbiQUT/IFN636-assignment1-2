# Student Attendance Manager

Student Attendance Manager is a full-stack CRUD web application developed for **IFN636 Assessment 1.2**. It extends the provided starter project into a real-world attendance tracking system using **Node.js, Express, MongoDB, React.js, GitHub, and CI/CD on AWS EC2**. The application supports two user roles: **Teacher** and **Student**.

## Project Overview

This system allows teachers to manage their own students and record attendance over time. Each attendance action is saved with an automatic timestamp, and the application updates attendance statistics such as total sessions, present count, late count, absent count, and attendance rate.

Students can log in to view their own attendance summary, including their teacher details and attendance statistics for each teacher-linked student record.

## Main Features

### Teacher Features
- Register and log in as a teacher
- Access the **Teacher Dashboard**
- Add new students
- Edit student details
- Delete students
- Record attendance as:
  - Present
  - Late
  - Absent
- Automatically update:
  - total sessions
  - present count
  - late count
  - absent count
  - attendance rate

### Student Features
- Register and log in as a student
- Access the **Student Portal**
- View:
  - teacher name
  - teacher email
  - course
  - total sessions
  - present count
  - late count
  - absent count
  - attendance rate

### Authentication and Authorisation
- Role-based registration (`teacher` or `student`)
- JWT-based login authentication
- Teachers can only manage **their own students**
- Students can only view **their own attendance summary**

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

### Frontend
- React.js
- React Router
- Axios
- Tailwind CSS

### DevOps / Deployment
- GitHub
- GitHub Actions
- Self-hosted GitHub Actions runner on AWS EC2
- PM2
- Nginx

## System Structure

### Backend
The backend provides REST API endpoints for:
- user registration and login
- teacher-owned student CRUD
- attendance recording
- student attendance summary

### Frontend
The frontend provides:
- Login page
- Register page
- Teacher Dashboard
- Student Portal
- Navbar with role-based navigation

## How the App Works

### Teacher Workflow
1. Register as a teacher
2. Log in
3. Open **Teacher Dashboard**
4. Add a student
5. Use **Make Attendance** to record Present / Late / Absent
6. Dashboard statistics update automatically

### Student Workflow
1. Register as a student
2. Log in
3. Open **Student Portal**
4. View attendance summary linked to teacher records

## Public URL

Public URL / Public IP:

```text
http://54.253.48.157:3000
