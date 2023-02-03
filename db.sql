CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    role VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    scheduletype VARCHAR(255) NOT NULL,
    rateperhour INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    active INT DEFAULT 1,
    fullname VARCHAR(255) NOT NULL,
    birthdate DATE NOT NULL,
    address VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL,
    CONSTRAINT UC_username UNIQUE (username)
)

CREATE TABLE profiles(
    id SERIAL PRIMARY KEY,
    employeeid INT NOT NULL,
    
    CONSTRAINT UC_employee_id UNIQUE (employeeid),
    CONSTRAINT fk_employee_profile
        FOREIGN KEY(employeeid)
            REFERENCES users(id)
)

CREATE TABLE hr_employee_logs(
    id SERIAL PRIMARY KEY,
    employeeid INT NOT NULL,
    log_date date DEFAULT CURRENT_DATE,
    time_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    time_out TIMESTAMP,
    CONSTRAINT fk_employee_logs_id
        FOREIGN KEY(employeeid)
            REFERENCES users(id)
)