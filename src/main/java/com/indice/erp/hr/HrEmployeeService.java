package com.indice.erp.hr;

import static com.indice.erp.hr.HrPayloadUtils.nullable;
import static com.indice.erp.hr.HrPayloadUtils.parseBigDecimal;
import static com.indice.erp.hr.HrPayloadUtils.parseDate;
import static com.indice.erp.hr.HrPayloadUtils.parseLong;
import static com.indice.erp.hr.HrPayloadUtils.safe;
import static com.indice.erp.hr.HrPayloadUtils.stringValue;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.NoSuchElementException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

@Service
public class HrEmployeeService {

    private final JdbcTemplate jdbcTemplate;
    private final HrAttendanceService hrAttendanceService;

    public HrEmployeeService(JdbcTemplate jdbcTemplate, HrAttendanceService hrAttendanceService) {
        this.jdbcTemplate = jdbcTemplate;
        this.hrAttendanceService = hrAttendanceService;
    }

    public Map<String, Object> listEmployees(long companyId) {
        var employees = jdbcTemplate.query(
            """
                SELECT e.id,
                       e.employee_number,
                       e.first_name,
                       e.last_name,
                       e.email,
                       e.phone,
                       e.position,
                       e.department,
                       e.unit_id,
                       u.name AS unit_name,
                       e.business_id,
                       b.name AS business_name,
                       e.hire_date,
                       COALESCE(e.salary, 0) AS salary,
                       e.pay_period,
                       e.salary_type,
                       e.hourly_rate,
                       e.contract_type,
                       e.contract_start_date,
                       e.contract_end_date,
                       e.termination_date,
                       e.last_working_day,
                       e.termination_reason_type,
                       e.termination_reason_code,
                       e.termination_summary,
                       COALESCE(e.status, 'active') AS status
                FROM hr_employees e
                LEFT JOIN units u ON u.id = e.unit_id
                LEFT JOIN businesses b ON b.id = e.business_id
                WHERE e.company_id = ?
                ORDER BY e.id DESC
                """,
            (rs, rowNum) -> mapEmployeeRow(rs),
            companyId
        );

        var summary = jdbcTemplate.queryForObject(
            """
                SELECT COUNT(*) AS total_count,
                       SUM(CASE WHEN LOWER(COALESCE(status, 'active')) = 'active' THEN 1 ELSE 0 END) AS active_count,
                       SUM(CASE WHEN LOWER(COALESCE(status, 'active')) = 'inactive' THEN 1 ELSE 0 END) AS inactive_count,
                       SUM(CASE WHEN LOWER(COALESCE(status, 'active')) = 'terminated' THEN 1 ELSE 0 END) AS terminated_count,
                       COALESCE(SUM(
                           CASE
                               WHEN LOWER(COALESCE(salary_type, 'daily')) = 'hourly' THEN COALESCE(hourly_rate, 0) * 8 * 22
                               ELSE COALESCE(salary, 0) * 30
                           END
                       ), 0) AS total_payroll_amount_monthly
                FROM hr_employees
                WHERE company_id = ?
                """,
            (rs, rowNum) -> {
                var body = new LinkedHashMap<String, Object>();
                body.put("total_count", rs.getInt("total_count"));
                body.put("active_count", rs.getInt("active_count"));
                body.put("inactive_count", rs.getInt("inactive_count"));
                body.put("terminated_count", rs.getInt("terminated_count"));
                body.put("total_payroll_amount_monthly", rs.getBigDecimal("total_payroll_amount_monthly"));
                return body;
            },
            companyId
        );

        var result = new LinkedHashMap<String, Object>();
        result.put("rows", employees);
        result.put("meta", summary != null ? summary : Map.of());
        return result;
    }

    public Map<String, Object> createEmployee(long companyId, long createdBy, Map<String, Object> payload) {
        var draft = buildEmployeeDraft(companyId, payload, false);

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            var statement = connection.prepareStatement(
                """
                    INSERT INTO hr_employees
                    (company_id, employee_number, first_name, last_name, email, phone, position, department, unit_id, business_id, hire_date, salary, pay_period, salary_type, hourly_rate, contract_type, contract_start_date, contract_end_date, status, created_by)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                new String[] {"id"}
            );
            statement.setLong(1, companyId);
            statement.setString(2, nullable(draft.employeeNumber()));
            statement.setString(3, draft.firstName());
            statement.setString(4, draft.lastName());
            statement.setString(5, draft.email());
            statement.setString(6, nullable(draft.phone()));
            statement.setString(7, nullable(draft.position()));
            statement.setString(8, nullable(draft.department()));
            setNullableLong(statement, 9, draft.unitId());
            setNullableLong(statement, 10, draft.businessId());
            if (draft.hireDate() == null) {
                statement.setNull(11, Types.DATE);
            } else {
                statement.setObject(11, draft.hireDate());
            }
            if (draft.salary() == null) {
                statement.setNull(12, Types.DECIMAL);
            } else {
                statement.setBigDecimal(12, draft.salary());
            }
            statement.setString(13, draft.payPeriod());
            statement.setString(14, draft.salaryType());
            if (draft.hourlyRate() == null) {
                statement.setNull(15, Types.DECIMAL);
            } else {
                statement.setBigDecimal(15, draft.hourlyRate());
            }
            statement.setString(16, draft.contractType());
            if (draft.contractStartDate() == null) {
                statement.setNull(17, Types.DATE);
            } else {
                statement.setObject(17, draft.contractStartDate());
            }
            if (draft.contractEndDate() == null) {
                statement.setNull(18, Types.DATE);
            } else {
                statement.setObject(18, draft.contractEndDate());
            }
            statement.setString(19, draft.status());
            statement.setLong(20, createdBy);
            return statement;
        }, keyHolder);

        var employeeId = keyHolder.getKey() != null ? keyHolder.getKey().longValue() : 0L;
        hrAttendanceService.ensureDefaultScheduleAssignment(companyId, employeeId, createdBy);
        hrAttendanceService.ensureDefaultAccessProfile(companyId, employeeId, createdBy);
        return employeeDetails(employeeId, companyId);
    }

    public Map<String, Object> updateEmployee(long companyId, Map<String, Object> payload) {
        var employeeId = parseLong(payload, "id", "employee_id");
        if (employeeId == null || employeeId <= 0) {
            throw new IllegalArgumentException("id is required.");
        }

        requireEmployee(companyId, employeeId);
        var draft = buildEmployeeDraft(companyId, payload, true);

        var rowsUpdated = jdbcTemplate.update(
            """
                UPDATE hr_employees
                SET employee_number = ?,
                    first_name = ?,
                    last_name = ?,
                    email = ?,
                    phone = ?,
                    position = ?,
                    department = ?,
                    unit_id = ?,
                    business_id = ?,
                    hire_date = ?,
                    salary = ?,
                    pay_period = ?,
                    salary_type = ?,
                    hourly_rate = ?,
                    contract_type = ?,
                    contract_start_date = ?,
                    contract_end_date = ?,
                    status = ?
                WHERE id = ? AND company_id = ?
                """,
            nullable(draft.employeeNumber()),
            draft.firstName(),
            draft.lastName(),
            draft.email(),
            nullable(draft.phone()),
            nullable(draft.position()),
            nullable(draft.department()),
            draft.unitId(),
            draft.businessId(),
            draft.hireDate(),
            draft.salary(),
            draft.payPeriod(),
            draft.salaryType(),
            draft.hourlyRate(),
            draft.contractType(),
            draft.contractStartDate(),
            draft.contractEndDate(),
            draft.status(),
            employeeId,
            companyId
        );

        if (rowsUpdated == 0) {
            throw new NoSuchElementException("Employee not found.");
        }

        hrAttendanceService.ensureDefaultScheduleAssignment(companyId, employeeId, 0L);
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

    public Map<String, Object> terminateEmployee(long companyId, long employeeId, Map<String, Object> payload) {
        requireEmployee(companyId, employeeId);

        var exitDate = parseDate(payload, "exit_date", "termination_date");
        if (exitDate == null) {
            throw new IllegalArgumentException("exit_date is required.");
        }

        var reasonType = normalizeTerminationReasonType(stringValue(payload, "reason_type"));
        var reasonCode = nullable(stringValue(payload, "specific_reason", "reason_code"));
        var summary = stringValue(payload, "summary", "termination_summary");
        if (summary.isBlank()) {
            throw new IllegalArgumentException("summary is required.");
        }

        var lastWorkingDay = parseDate(payload, "last_working_day");
        if (lastWorkingDay == null) {
            lastWorkingDay = exitDate;
        }

        var rowsUpdated = jdbcTemplate.update(
            """
                UPDATE hr_employees
                SET status = 'terminated',
                    termination_date = ?,
                    last_working_day = ?,
                    termination_reason_type = ?,
                    termination_reason_code = ?,
                    termination_summary = ?
                WHERE id = ? AND company_id = ?
                """,
            exitDate,
            lastWorkingDay,
            reasonType,
            reasonCode,
            summary,
            employeeId,
            companyId
        );

        if (rowsUpdated == 0) {
            throw new NoSuchElementException("Employee not found.");
        }

        return employeeDetails(employeeId, companyId);
    }

    private EmployeeDraft buildEmployeeDraft(long companyId, Map<String, Object> payload, boolean update) {
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
        var unitId = normalizeOptionalForeignKey(parseLong(payload, "unit_id", "unidad_id", "unidadNegocio"));
        var businessId = normalizeOptionalForeignKey(parseLong(payload, "business_id", "negocio_id", "negocio"));
        var hireDate = parseDate(payload, "hire_date", "fechaIngreso");
        var salary = parseBigDecimal(payload, "salary", "salario");
        var payPeriod = normalizePayPeriod(stringValue(payload, "pay_period", "periodoPago"));
        var salaryType = normalizeSalaryType(stringValue(payload, "salary_type", "tipoSalario"));
        var hourlyRate = parseBigDecimal(payload, "hourly_rate", "sueldoPorHora");
        var contractType = normalizeContractType(stringValue(payload, "contract_type", "tipoContrato"));
        var contractStartDate = parseDate(payload, "contract_start_date", "fechaInicioContrato");
        var contractEndDate = parseDate(payload, "contract_end_date", "fechaFinContrato");
        var status = normalizeEmployeeStatus(stringValue(payload, "status", "estado"));

        if (position.isBlank()) {
            throw new IllegalArgumentException("position is required.");
        }

        if (department.isBlank()) {
            throw new IllegalArgumentException("department is required.");
        }

        if (unitId == null) {
            throw new IllegalArgumentException("unit_id is required.");
        }

        if (businessId == null) {
            throw new IllegalArgumentException("business_id is required.");
        }

        validateOrganizationRefs(companyId, unitId, businessId);
        if (contractType.equals("temporary") && contractEndDate == null) {
            throw new IllegalArgumentException("Temporary contracts require contract_end_date.");
        }

        if ("daily".equals(salaryType)) {
            if (salary == null) {
                throw new IllegalArgumentException("salary is required for daily employees.");
            }

            if (salary.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("salary must be greater than zero for daily employees.");
            }
        }

        if ("hourly".equals(salaryType) && hourlyRate == null) {
            throw new IllegalArgumentException("hourly_rate is required for hourly employees.");
        }

        if ("hourly".equals(salaryType) && hourlyRate.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("hourly_rate must be greater than zero for hourly employees.");
        }

        if ("hourly".equals(salaryType)) {
            salary = salary == null ? BigDecimal.ZERO : salary;
        }

        if (contractStartDate == null && hireDate != null) {
            contractStartDate = hireDate;
        }

        return new EmployeeDraft(
            employeeNumber,
            firstName,
            lastName,
            email,
            phone,
            position,
            department,
            unitId,
            businessId,
            hireDate,
            salary,
            payPeriod,
            salaryType,
            hourlyRate,
            contractType,
            contractStartDate,
            contractEndDate,
            status
        );
    }

    private void validateOrganizationRefs(long companyId, Long unitId, Long businessId) {
        if (unitId != null) {
            var unitCount = jdbcTemplate.queryForObject(
                """
                    SELECT COUNT(*)
                    FROM units
                    WHERE id = ?
                      AND (company_id = ? OR company_id IS NULL)
                    """,
                Integer.class,
                unitId,
                companyId
            );
            if (unitCount == null || unitCount == 0) {
                throw new IllegalArgumentException("Selected unit does not exist.");
            }
        }

        if (businessId != null) {
            var businessMatches = jdbcTemplate.query(
                """
                    SELECT id, unit_id
                    FROM businesses
                    WHERE id = ?
                      AND (company_id = ? OR company_id IS NULL)
                    LIMIT 1
                    """,
                (rs, rowNum) -> new BusinessRef(rs.getLong("id"), getNullableLong(rs, "unit_id")),
                businessId,
                companyId
            );
            if (businessMatches.isEmpty()) {
                throw new IllegalArgumentException("Selected business does not exist.");
            }

            var business = businessMatches.getFirst();
            if (unitId != null && business.unitId() != null && !unitId.equals(business.unitId())) {
                throw new IllegalArgumentException("The selected business does not belong to the selected unit.");
            }
        }
    }

    private void requireEmployee(long companyId, long employeeId) {
        var count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM hr_employees WHERE company_id = ? AND id = ?",
            Integer.class,
            companyId,
            employeeId
        );
        if (count == null || count == 0) {
            throw new NoSuchElementException("Employee not found.");
        }
    }

    private Map<String, Object> employeeDetails(long employeeId, long companyId) {
        var rows = jdbcTemplate.query(
            """
                SELECT e.id,
                       e.employee_number,
                       e.first_name,
                       e.last_name,
                       e.email,
                       e.phone,
                       e.position,
                       e.department,
                       e.unit_id,
                       u.name AS unit_name,
                       e.business_id,
                       b.name AS business_name,
                       e.hire_date,
                       COALESCE(e.salary, 0) AS salary,
                       e.pay_period,
                       e.salary_type,
                       e.hourly_rate,
                       e.contract_type,
                       e.contract_start_date,
                       e.contract_end_date,
                       e.termination_date,
                       e.last_working_day,
                       e.termination_reason_type,
                       e.termination_reason_code,
                       e.termination_summary,
                       COALESCE(e.status, 'active') AS status
                FROM hr_employees e
                LEFT JOIN units u ON u.id = e.unit_id
                LEFT JOIN businesses b ON b.id = e.business_id
                WHERE e.id = ? AND e.company_id = ?
                LIMIT 1
                """,
            (rs, rowNum) -> mapEmployeeRow(rs),
            employeeId,
            companyId
        );

        if (rows.isEmpty()) {
            throw new NoSuchElementException("Employee not found.");
        }

        return Map.of("employee_id", employeeId, "employee", rows.getFirst());
    }

    private Map<String, Object> mapEmployeeRow(ResultSet rs) throws SQLException {
        var fullName = String.join(
            " ",
            safe(rs.getString("first_name")),
            safe(rs.getString("last_name"))
        ).trim();

        var employee = new LinkedHashMap<String, Object>();
        employee.put("id", rs.getLong("id"));
        employee.put("employee_number", safe(rs.getString("employee_number")));
        employee.put("first_name", safe(rs.getString("first_name")));
        employee.put("last_name", safe(rs.getString("last_name")));
        employee.put("full_name", fullName);
        employee.put("email", safe(rs.getString("email")));
        employee.put("phone", safe(rs.getString("phone")));
        employee.put("position", safe(rs.getString("position")));
        employee.put("position_title", safe(rs.getString("position")));
        employee.put("department", safe(rs.getString("department")));
        employee.put("unit_id", getNullableLong(rs, "unit_id"));
        employee.put("unit_name", safe(rs.getString("unit_name")));
        employee.put("business_id", getNullableLong(rs, "business_id"));
        employee.put("business_name", safe(rs.getString("business_name")));
        employee.put("hire_date", rs.getObject("hire_date"));
        employee.put("salary", rs.getBigDecimal("salary"));
        employee.put("pay_period", normalizePayPeriod(rs.getString("pay_period")));
        employee.put("salary_type", normalizeSalaryType(rs.getString("salary_type")));
        employee.put("hourly_rate", rs.getBigDecimal("hourly_rate"));
        employee.put("contract_type", normalizeContractType(rs.getString("contract_type")));
        employee.put("contract_start_date", rs.getObject("contract_start_date"));
        employee.put("contract_end_date", rs.getObject("contract_end_date"));
        employee.put("termination_date", rs.getObject("termination_date"));
        employee.put("last_working_day", rs.getObject("last_working_day"));
        employee.put("termination_reason_type", safe(rs.getString("termination_reason_type")));
        employee.put("termination_reason_code", safe(rs.getString("termination_reason_code")));
        employee.put("termination_summary", safe(rs.getString("termination_summary")));
        employee.put("status", normalizeEmployeeStatus(rs.getString("status")));
        return employee;
    }

    private Long normalizeOptionalForeignKey(Long value) {
        return value == null || value <= 0 ? null : value;
    }

    private String normalizePayPeriod(String value) {
        var normalized = value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "", "weekly", "semanal" -> "weekly";
            case "biweekly", "quincenal" -> "biweekly";
            case "monthly", "mensual" -> "monthly";
            default -> throw new IllegalArgumentException("Unsupported pay_period.");
        };
    }

    private String normalizeSalaryType(String value) {
        var normalized = value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "", "daily", "diario" -> "daily";
            case "hourly", "por_hora", "hourly_salary" -> "hourly";
            default -> throw new IllegalArgumentException("Unsupported salary_type.");
        };
    }

    private String normalizeContractType(String value) {
        var normalized = value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "", "permanent", "permanente" -> "permanent";
            case "temporary", "temporal" -> "temporary";
            default -> throw new IllegalArgumentException("Unsupported contract_type.");
        };
    }

    private String normalizeEmployeeStatus(String value) {
        var normalized = value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "", "active", "activo" -> "active";
            case "inactive", "inactivo" -> "inactive";
            case "terminated", "terminado" -> "terminated";
            default -> throw new IllegalArgumentException("Unsupported employee status.");
        };
    }

    private String normalizeTerminationReasonType(String value) {
        var normalized = value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "resignation", "termination_for_cause", "contract_end", "mutual_agreement", "other" -> normalized;
            default -> throw new IllegalArgumentException("Unsupported reason_type.");
        };
    }

    private Long getNullableLong(ResultSet rs, String column) throws SQLException {
        var value = rs.getLong(column);
        return rs.wasNull() ? null : value;
    }

    private void setNullableLong(java.sql.PreparedStatement statement, int parameterIndex, Long value) throws SQLException {
        if (value == null) {
            statement.setNull(parameterIndex, Types.BIGINT);
        } else {
            statement.setLong(parameterIndex, value);
        }
    }

    private record EmployeeDraft(
        String employeeNumber,
        String firstName,
        String lastName,
        String email,
        String phone,
        String position,
        String department,
        Long unitId,
        Long businessId,
        LocalDate hireDate,
        BigDecimal salary,
        String payPeriod,
        String salaryType,
        BigDecimal hourlyRate,
        String contractType,
        LocalDate contractStartDate,
        LocalDate contractEndDate,
        String status
    ) {
    }

    private record BusinessRef(
        long id,
        Long unitId
    ) {
    }
}
