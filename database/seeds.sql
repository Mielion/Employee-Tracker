INSERT INTO department (name) VALUES 
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO role (title, salary, department_id) VALUES 
('Sales leads', 100, 1),
('Sales person', 200, 2),
('Lead Engineear', 300, 1),
('Software Engineer', 400, 3),
('Account Manager', 100000, 4),
('Accountant', 30000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, 2),
('Mike', 'Chan', 2, 2),
('Ashley', 'Rodriguez', 1, 1),
('Kevin', 'Tupik', 1, 3),
('Kunal', 'Singh', 4, 2),
('Malia', 'Brown', 4, 4);