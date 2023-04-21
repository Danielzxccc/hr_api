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

CREATE TABLE schedule(
    id SERIAL PRIMARY KEY,
    employeeid INT NOT NULL,
    shift_timein TIME,
    shift_timeout TIME,
    day VARCHAR(10),
    CONSTRAINT fk_employee_schedule
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

CREATE TABLE hr_payroll(
    id SERIAL PRIMARY KEY,
    employeeid INT NOT NULL,
    paydate date NOT NULL,
    startdate date NOT NULL,
    enddate date NOT NULL,
    hoursworked jsonb NOT NULL,
    overtime jsonb NOT NULL,
    percupcommision jsonb NOT NULL,
    grosspay INT NOT NULL,
    advance INT NOT NULL,
    bonus INT NOT NULL,
    sss INT NOT NULL,
    philhealth INT NOT NULL,
    pagibig INT NOT NULL,
    recentadvance INT NOT NULL,
     CONSTRAINT fk_employee_payroll_id
        FOREIGN KEY(employeeid)
            REFERENCES users(id)
)

CREATE TABLE hr_audit_logs(
    id SERIAL PRIMARY KEY,
    employeeid INT NOT NULL,
    activity VARCHAR NOT NULL,
    actiondate DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_employee_payroll_id
        FOREIGN KEY(employeeid)
            REFERENCES users(id)
)



SELECT hr_employee_logs.*, 
CEIL(EXTRACT(EPOCH FROM (time_out - time_in))/3600) as totalhours, 
CEIL(EXTRACT(EPOCH FROM (time_out - time_in))/3600) * users.rateperhour AS total_cost
FROM hr_employee_logs
JOIN users ON hr_employee_logs.employeeid = users.id
WHERE time_out > time_in AND id = 1
AND users.department != 'hr'