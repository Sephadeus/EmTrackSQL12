INSERT INTO department(department_name)
VALUES ("Marketing"),
    ("Accounting"),
    ("Research and Development"),
    ("Maintenance"),
    ("Logistics"),
    ("Distribution");

INSERT INTO role(title, salary, department_id)
VALUES ("Marketing Director", 90000.00, 1),
    ("Accounting Manager", 100000.00, 2),
    ("Research and Development Analyst", 70000.00, 3),
    ("Maintenance Supervisor", 65000.50, 4),
    ("Logistics Lead Supervisor", 90000.00, 5),
    ("Distribution Warehouse Head", 80000.00, 6);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES 
('Don', 'Trump', 1, 1),
('Don', 'Jr', 2, NULL),
('Jake', 'Tapper', 3, Null),
('Joe', 'Rogan', 5, 2),
('Young', 'Jamie', 6, NULL);
