INSERT INTO department(department_name)
VALUES ("Marketing"),
    ("Accounting"),
    ("Research and Development"),
    ("Maintenance"),
    ("Logistics"),
    ("Distribution");

INSERT INTO role(title, salary, department_id)
VALUES ("Chief Marketing Officer", 190000.00, 1),
("Marketing Analyst", 90000.00, 1),
("Market Researcher", 90000.00, 1),
    ("Chief Financial Officer", 150000.00, 2),
        ("Accounting Professional", 120000.00, 2),
        ("Accounting Assistant", 90000.00, 2),
    ("Chief Research Officer", 170000.00, 3),
    ("Research and Development Analyst", 70000.00, 3),
    ("Maintenance Supervisor", 95000.50, 4),
        ("Maintenance Team Member", 65000.50, 4),
    ("Chief Logistics Officer", 190000.00, 5),
    ("Logistics Supervisor", 90000.00, 5),
        ("Logistics Worker", 90000.00, 5),
            ("Chief Distribution Officer", 180000.00, 6),
    ("Distribution Warehouse Head", 180000.00, 6);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES 
('Don', 'Trump', 1, NULL),
('Victoria', 'Sommers', 4, NULL),
('John', 'Smith', 7, NULL),
('Ron', 'Jaeger', 9, NULL),
('Joe', 'Rogan', 11, NULL),
('Adrian', 'Jackson', 14, NULL);
