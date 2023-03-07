INSERT INTO departments (name)
VALUES ("Human Resources"),
       ("Sales"),
       ("Engineering");

INSERT INTO roles (title, salary, department_id) 
VALUES ("Manager", 200000, 1),
       ("Accounting", 110000, 1),
       ("Software Engineer", 90000, 3),
       ("Sales Manager", 165000, 2),
       ("Sales Rep", 70000, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("James", "Dean", 1, null),
       ("Nik", "Cage", 2, 1),
       ("Sam", "Gamgee", 3, 2);