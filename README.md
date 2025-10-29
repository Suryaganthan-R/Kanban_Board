# Kanban Board Application

A modern, responsive Kanban board web application built with Spring Boot and Thymeleaf.

## Tech Stack

- **Backend**: Spring Boot (Spring Web, Spring Data JPA)
- **Database**: MySQL
- **Frontend**: Thymeleaf with HTML/CSS/JavaScript
- **Build Tool**: Maven
- **Additional**: Lombok, Bootstrap 5

## Features

- Create, read, update, and delete tasks
- Drag-and-drop functionality to move tasks between columns
- Responsive design that works on desktop and mobile
- Modern, visually appealing UI
- Task priority management (Low, Medium, High)
- User assignment for tasks

## Prerequisites

- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## Database Setup

1. Install MySQL and create a database:
```sql
CREATE DATABASE kanban_board;
```

2. Run the database setup script:
```bash
mysql -u root -p < database_setup.sql
```

## Running the Application

1. Clone or download the project
2. Navigate to the project directory
3. Run the application:
```bash
mvn spring-boot:run
```

4. Open your browser and go to: `http://localhost:8080`

## API Endpoints

### Users
- `POST /api/users` - Create new user
- `GET /api/users` - Get all users

### Columns
- `POST /api/columns` - Create new column
- `GET /api/columns` - Get all columns

### Tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get task by ID
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PUT /api/tasks/move` - Move task to different column

### Board
- `GET /api/boards` - Get tasks grouped by column

## Project Structure

```
com.kanbanboard/
├── controller/          # REST and Web controllers
├── service/            # Business logic services
├── repository/         # Data access repositories
├── model/             # JPA entities
└── KanbanBoardApplication.java
```

## Database Schema

### Users Table
- `user_id` (SERIAL, Primary Key)
- `name` (VARCHAR(50))
- `email` (VARCHAR(100), Unique)
- `join_date` (TIMESTAMP)

### Columns Table
- `column_id` (SERIAL, Primary Key)
- `name` (VARCHAR(50))
- `position` (INTEGER)

### Tasks Table
- `task_id` (SERIAL, Primary Key)
- `user_id` (INTEGER, Foreign Key)
- `column_id` (INTEGER, Foreign Key)
- `title` (VARCHAR(100))
- `description` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `priority` (ENUM: Low, Medium, High)

## Usage

1. **View Board**: The main page displays the Kanban board with three default columns
2. **Add Task**: Click "Add Task" button to create a new task
3. **Move Tasks**: Drag and drop tasks between columns
4. **Edit Task**: Click the edit icon on any task card
5. **Delete Task**: Click the delete icon on any task card

## Configuration

Database configuration is in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/kanban_board
spring.datasource.username=root
spring.datasource.password=root
```

## Troubleshooting

1. **Database Connection Issues**: Ensure PostgreSQL is running and credentials are correct
2. **Port Conflicts**: Change server port in application.properties if 8080 is in use
3. **Build Issues**: Ensure Java 17+ and Maven are properly installed