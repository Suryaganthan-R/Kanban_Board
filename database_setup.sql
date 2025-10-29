-- Create database
CREATE DATABASE kanban_board;

-- Use the database
USE kanban_board;

-- Create Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    join_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Columns table
CREATE TABLE columns (
    column_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    position INT NOT NULL
);

-- Create Tasks table
CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    column_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    priority ENUM('Low', 'Medium', 'High') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (column_id) REFERENCES columns(column_id) ON DELETE CASCADE
);

-- Insert default columns
INSERT INTO columns (name, position) VALUES 
('To Do', 1),
('In Progress', 2),
('Done', 3);

-- Insert sample users
INSERT INTO users (name, email) VALUES 
('John Doe', 'john.doe@example.com'),
('Jane Smith', 'jane.smith@example.com'),
('Mike Johnson', 'mike.johnson@example.com');

-- Insert sample tasks
INSERT INTO tasks (user_id, column_id, title, description, priority) VALUES 
(1, 1, 'Setup Project Structure', 'Create the basic project structure and configuration', 'High'),
(2, 1, 'Design Database Schema', 'Design and implement the database schema', 'Medium'),
(1, 2, 'Implement REST APIs', 'Create REST endpoints for CRUD operations', 'High'),
(3, 2, 'Create UI Components', 'Build the frontend components for the Kanban board', 'Medium'),
(2, 3, 'Write Documentation', 'Create user and developer documentation', 'Low'),
(3, 3, 'Setup CI/CD Pipeline', 'Configure continuous integration and deployment', 'Medium');