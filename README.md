# SocityOne

SocityOne is a comprehensive and centralized application designed for modern Society Management. The platform provides seamless communication, administration, and management of residential societies, flats, and bungalows.

## Project Structure

SocityOne consists of three primary interfaces:
- **Mobile Application**: Built with **React Native CLI**, providing a user-friendly interface for society residents.
- **Admin Panel**: Built with **Vite React**, serving as the central dashboard for society admins to manage operations, users, and announcements.
- **Backend API**: The central brain connecting the database, admin panel, and mobile apps.

---

## Backend Architecture (Python & FastAPI)

Since the future roadmap includes automating processes with Artificial Intelligence and you already possess knowledge of Python (Flask) and Express, the chosen backend architecture is **Python with FastAPI**.

### Why Python with FastAPI?
- **AI Readiness**: Python is the undisputed king of AI and machine learning. As you plan to learn and implement AI automations in the future, being in the Python ecosystem makes integrating tools like TensorFlow, PyTorch, or OpenAI completely seamless.
- **Natural Progression from Flask**: Since you already know Flask, transitioning to FastAPI will feel incredibly natural. FastAPI takes the lightweight, decorator-based routing you love in Flask and supercharges it with modern features.
- **Speed & Type Safety**: FastAPI is one of the fastest Python frameworks available. It natively uses Pydantic for data validation, meaning you get strict type-checking and fewer runtime errors.
- **Auto-Documentation**: FastAPI automatically generates interactive Swagger UI documentation out of the box, which is extremely helpful when connecting the backend to your Vite React Admin Panel and React Native Mobile App.

### Database Management
- **Primary Database**: **PostgreSQL** (Relational, robust, and great for structured data like users, rooms, and payments).
- **ORM / Future-proofing**: We will use **SQLAlchemy** (or SQLModel, which is built by the creator of FastAPI). This provides a robust way to interact with PostgreSQL and easily accommodates connecting to multiple databases in the future (e.g., separating chat databases from core relational data).

---

## Core Modules

The application is divided into several major modules. Detailed plans for each module can be found in the `Plan/` directory.

1. **Basic Modules (Users & Roles)**: User, role, permission, and subscription management.
2. **Stay Module**: Information regarding flats, rooms, and bungalows.
3. **Family Management**: Managing family details per room, including owner vs. tenant (rent) status.
4. **Document Storage Locker**: A secure, encrypted vault for storing important resident and society documents.
5. **Advertisement**: A system for admins to provide and manage different advertisements within the app.
6. **Complaints**: A ticketing system for residents to raise and track issues.
7. **Celebration & Common Events**: Event planning, RSVPs, and community gathering notices.
8. **Contact Directory**: A secure directory for communication among resident families.
9. **Payment Management**: Maintenance fee tracking, payment gateways, and receipts.
