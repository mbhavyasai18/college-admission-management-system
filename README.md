# college-admission-management-system
A Spring Boot and React based College Admission Management System with student registration, admission status tracking, and course management.

## Architecture

The following diagram shows the high-level architecture of the system:

![System Architecture Diagram](docs/system-architecture.jpg)

## 🗃️ Database Schema (ERD)

The Entity Relationship Diagram below shows the structure of the application's database.

![Database ERD](docs/database-erd.png)

**Tables:**
- **student:** Stores student personal information.
- **application:** Records each application a student submits.
- **course:** Contains the available courses for admission.

## 🖥️ User Interface (Screenshots)

### Student Portal

#### Dashboard
The main hub for students after logging in.
![Student Dashboard](docs/ui/student-dashboard.png)

#### Application Form
The form for submitting a new admission application.
![Application Form](docs/ui/application-form.png)

#### Application Status
View the current status of all submitted applications.
![Application Status](docs/ui/application-status.png)

### Admin Portal

#### Dashboard
The main hub for administrators to manage the system.
![Admin Dashboard](docs/ui/admin-dashboard.png)

#### Manage Applications
View and update the status of all student applications.
![Manage Applications](docs/ui/admin-applications-list.png)