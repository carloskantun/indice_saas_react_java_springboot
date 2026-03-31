package com.indice.erp.hr;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

@Service
public class HrEmployeeService {

    private final JdbcTemplate jdbcTemplate;

    public HrEmployeeService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Map<String, Object> listEmployees(long companyId) {
        var employees = jdbcTemplate.query(
            """
                SELECT id,
                       employee_number,
                       first_name,
                       last_name,
                       email,
                       phone,
                       position,
                       department,
                       hire_date,
                       COALESCE(salary, 0) AS salary,
                       status
                FROM hr_employees
                WHERE company_id = ?
                ORDER BY id DESC
                """,
            (rs, rowNum) -> {
                var fullName = String.join(" ",
                    safe(rs.getString("first_name")),
                    safe(rs.getString("last_name"))
                ).trim();

                var employee = new LinkedHashMap<String, Object>();
                employee.put("id", rs.getLong("id"));
                employee.put("full_name", fullName);
                employee.put("email", safe(rs.getString("email")));
                employee.put("employee_number", safe(rs.getString("employee_number")));
                employee.put("status", safe(rs.getString("status")));
                employee.put("position_title", safe(rs.getString("position")));
                employee.put("department", safe(rs.getString("department")));
                employee.put("phone", safe(rs.getString("phone")));
                employee.put("hire_date", rs.getObject("hire_date"));
                employee.put("salary", rs.getBigDecimal("salary") != null ? rs.getBigDecimal("salary") : BigDecimal.ZERO);
                return employee;
            },
            companyId
        );

        var totalPayroll = jdbcTemplate.queryForObject(
            "SELECT COALESCE(SUM(salary), 0) FROM hr_employees WHERE company_id = ?",
            BigDecimal.class,
            companyId
        );

        var meta = new LinkedHashMap<String, Object>();
        meta.put("total_count", employees.size());
        meta.put("total_payroll_amount_monthly", totalPayroll != null ? totalPayroll : BigDecimal.ZERO);

        var result = new LinkedHashMap<String, Object>();
        result.put("rows", employees);
        result.put("meta", meta);
        return result;
    }

    public Map<String, Object> createEmployee(long companyId, long createdBy, Map<String, Object> payload) {
        var firstName = stringValue(payload, "first_name", "nombre");
        var lastName = stringValue(payload, "last_name", "apellidos");
        var email = stringValue(payload, "email", "correo");

        if (firstName.isBlank() || lastName.isBlank() || email.isBlank()) {
            throw new IllegalArgumentException("first_name, last_name, and email are required.");
        }

        var employeeNumber = stringValue(payload, "employee_number", "employee_code");
        var phone = stringValue(payload, "phone", "telefono", "telefonoMovil", "mobile");
        var position = stringValue(payload, "position", "job_title", "puesto");
        var department = stringValue(payload, "department", "departamento");
        var hireDate = parseDate(payload, "hire_date", "fechaIngreso");
        var salary = parseBigDecimal(payload, "salary", "salario");
        var status = stringValue(payload, "status", "estado");
        if (status.isBlank()) {
            status = "active";
        }
        final var finalStatus = status;

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            var statement = connection.prepareStatement(
                """
                    INSERT INTO hr_employees
                    (company_id, employee_number, first_name, last_name, email, phone, position, department, hire_date, salary, status, created_by)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                new String[] {"id"}
            );
            statement.setLong(1, companyId);
            statement.setString(2, employeeNumber.isBlank() ? null : employeeNumber);
            statement.setString(3, firstName);
            statement.setString(4, lastName);
            statement.setString(5, email);
            statement.setString(6, phone.isBlank() ? null : phone);
            statement.setString(7, position.isBlank() ? null : position);
            statement.setString(8, department.isBlank() ? null : department);
            if (hireDate != null) {
                statement.setObject(9, hireDate);
            } else {
                statement.setNull(9, java.sql.Types.DATE);
            }
            if (salary != null) {
                statement.setBigDecimal(10, salary);
            } else {
                statement.setNull(10, java.sql.Types.DECIMAL);
            }
            statement.setString(11, finalStatus);
            statement.setLong(12, createdBy);
            return statement;
        }, keyHolder);

        var employeeId = keyHolder.getKey() != null ? keyHolder.getKey().longValue() : 0L;
        return employeeDetails(employeeId, companyId);
    }

    public Map<String, Object> updateEmployee(long companyId, Map<String, Object> payload) {
        var employeeId = parseLong(payload, "id", "employee_id");
        if (employeeId == null || employeeId <= 0) {
            throw new IllegalArgumentException("id is required.");
        }

        var firstName = stringValue(payload, "first_name", "nombre");
        var lastName = stringValue(payload, "last_name", "apellidos");
        var email = stringValue(payload, "email", "correo");
        var phone = stringValue(payload, "phone", "telefono", "telefonoMovil", "mobile");
        var position = stringValue(payload, "position", "job_title", "puesto");
        var department = stringValue(payload, "department", "departamento");
        var hireDate = parseDate(payload, "hire_date", "fechaIngreso");
        var salary = parseBigDecimal(payload, "salary", "salario");
        var status = stringValue(payload, "status", "estado");

        var rowsUpdated = jdbcTemplate.update(
            """
                UPDATE hr_employees
                SET first_name = COALESCE(?, first_name),
                    last_name = COALESCE(?, last_name),
                    email = COALESCE(?, email),
                    phone = COALESCE(?, phone),
                    position = COALESCE(?, position),
                    department = COALESCE(?, department),
                    hire_date = COALESCE(?, hire_date),
                    salary = COALESCE(?, salary),
                    status = COALESCE(?, status)
                WHERE id = ? AND company_id = ?
                """,
            nullable(firstName),
            nullable(lastName),
            nullable(email),
            nullable(phone),
            nullable(position),
            nullable(department),
            hireDate,
            salary,
            nullable(status),
            employeeId,
            companyId
        );

        if (rowsUpdated == 0) {
            throw new NoSuchElementException("Employee not found.");
        }

        return employeeDetails(employeeId, companyId);
    }

    public void deleteEmployee(long companyId, long employeeId) {
        var rowsUpdated = jdbcTemplate.update(
            "DELETE FROM hr_employees WHERE id = ? AND company_id = ?",
            employeeId,
            companyId
        );
        if (rowsUpdated == 0) {
            throw new NoSuchElementException("Employee not found.");
        }
    }

    public void terminateEmployee(long companyId, long employeeId) {
        var rowsUpdated = jdbcTemplate.update(
            "UPDATE hr_employees SET status = 'inactive' WHERE id = ? AND company_id = ?",
            employeeId,
            companyId
        );
        if (rowsUpdated == 0) {
            throw new NoSuchElementException("Employee not found.");
        }
    }

    private Map<String, Object> employeeDetails(long employeeId, long companyId) {
        var rows = jdbcTemplate.query(
            """
                SELECT id, employee_number, first_name, last_name, email, phone, position, department, hire_date, salary, status
                FROM hr_employees
                WHERE id = ? AND company_id = ?
                LIMIT 1
                """,
            (rs, rowNum) -> {
                var result = new LinkedHashMap<String, Object>();
                result.put("id", rs.getLong("id"));
                result.put("employee_number", safe(rs.getString("employee_number")));
                result.put("first_name", safe(rs.getString("first_name")));
                result.put("last_name", safe(rs.getString("last_name")));
                result.put("full_name", (safe(rs.getString("first_name")) + " " + safe(rs.getString("last_name"))).trim());
                result.put("email", safe(rs.getString("email")));
                result.put("phone", safe(rs.getString("phone")));
                result.put("position", safe(rs.getString("position")));
                result.put("department", safe(rs.getString("department")));
                result.put("hire_date", rs.getObject("hire_date"));
                result.put("salary", rs.getBigDecimal("salary"));
                result.put("status", safe(rs.getString("status")));
                return result;
            },
            employeeId,
            companyId
        );

        if (rows.isEmpty()) {
            throw new NoSuchElementException("Employee not found.");
        }

        return Map.of("employee_id", employeeId, "employee", rows.getFirst());
    }

    private String stringValue(Map<String, Object> payload, String... keys) {
        for (var key : keys) {
            var value = payload.get(key);
            if (value instanceof String string && !string.isBlank()) {
                return string.trim();
            }
        }
        return "";
    }

    private Long parseLong(Map<String, Object> payload, String... keys) {
        for (var key : keys) {
            var value = payload.get(key);
            if (value instanceof Number number) {
                return number.longValue();
            }
            if (value instanceof String string && !string.isBlank()) {
                try {
                    return Long.parseLong(string.trim());
                } catch (NumberFormatException ex) {
                    throw new IllegalArgumentException(key + " must be numeric.");
                }
            }
        }
        return null;
    }

    private BigDecimal parseBigDecimal(Map<String, Object> payload, String... keys) {
        var raw = stringValue(payload, keys);
        if (raw.isBlank()) {
            return null;
        }
        try {
            return new BigDecimal(raw);
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException(keys[0] + " must be a valid number.");
        }
    }

    private LocalDate parseDate(Map<String, Object> payload, String... keys) {
        var raw = stringValue(payload, keys);
        if (raw.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(raw);
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException(keys[0] + " must use YYYY-MM-DD format.");
        }
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private Object nullable(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}
