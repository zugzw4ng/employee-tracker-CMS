USE employees_db;

INSERT INTO department (name)
VALUES 
('Cybersecurity'),
('Sales'),
('Legal'),
('Human Resources'),
('Research and Development'),
('Consulting');

INSERT INTO role (title, salary, department_id)
VALUES
('Security Engineer', 75000, 1),
('Sales Rep', 55000, 2),
('Attourney', 95000, 3),
('Manager', 60000, 4),
('Engineer', 90000, 5),
('Consultant', 80000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Anwar', 'Brown', 1, 890),
('Cynthia', 'Drangus', 2, 999),
('Esteban', 'Farnswerth', 3, 789),
('Georgina', 'Isenberg', 4, 777),
('Jacob', 'Kelly', 5, 119),
('Lorraine', 'Morningstar', 6, NULL);