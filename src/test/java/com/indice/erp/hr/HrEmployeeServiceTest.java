package com.indice.erp.hr;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

@ExtendWith(MockitoExtension.class)
class HrEmployeeServiceTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @Mock
    private HrAttendanceService hrAttendanceService;

    @Test
    void listEmployeesAllowsNullOptionalColumns() throws Exception {
        var service = new HrEmployeeService(jdbcTemplate, hrAttendanceService);

        when(jdbcTemplate.query(anyString(), any(RowMapper.class), eq(1L)))
            .thenAnswer(invocation -> {
                @SuppressWarnings("unchecked")
                var rowMapper = (RowMapper<Map<String, Object>>) invocation.getArgument(1);
                ResultSet rs = employeeResultSet();
                return List.of(rowMapper.mapRow(rs, 0));
            });

        when(jdbcTemplate.queryForObject(anyString(), any(RowMapper.class), eq(1L)))
            .thenAnswer(invocation -> {
                @SuppressWarnings("unchecked")
                var rowMapper = (RowMapper<Map<String, Object>>) invocation.getArgument(1);
                ResultSet rs = mock(ResultSet.class);
                when(rs.getInt("total_count")).thenReturn(1);
                when(rs.getInt("active_count")).thenReturn(1);
                when(rs.getInt("inactive_count")).thenReturn(0);
                when(rs.getInt("terminated_count")).thenReturn(0);
                when(rs.getBigDecimal("total_payroll_amount_monthly")).thenReturn(new BigDecimal("6500.00"));
                return rowMapper.mapRow(rs, 0);
            });

        var result = service.listEmployees(1L);

        @SuppressWarnings("unchecked")
        var rows = (List<Map<String, Object>>) result.get("rows");
        assertEquals(1, rows.size());
        assertEquals("Second Empleado", rows.getFirst().get("full_name"));
        assertEquals("", rows.getFirst().get("employee_number"));
        assertEquals("", rows.getFirst().get("phone"));
        assertNull(rows.getFirst().get("hire_date"));
        assertEquals(new BigDecimal("6500.00"), rows.getFirst().get("salary"));
    }

    @Test
    void updateEmployeeThrowsWhenEmployeeDoesNotExist() {
        var service = new HrEmployeeService(jdbcTemplate, hrAttendanceService);
        var payload = new HashMap<String, Object>();
        payload.put("id", 999L);
        payload.put("first_name", "Missing");
        payload.put("last_name", "Employee");
        payload.put("email", "missing@example.com");

        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(1L), eq(999L)))
            .thenReturn(0);

        assertThrows(NoSuchElementException.class, () -> service.updateEmployee(1L, payload));
    }

    @Test
    void updateEmployeeRejectsInvalidHireDate() {
        var service = new HrEmployeeService(jdbcTemplate, hrAttendanceService);
        var payload = new HashMap<String, Object>();
        payload.put("id", 2L);
        payload.put("first_name", "Test");
        payload.put("last_name", "Employee");
        payload.put("email", "test@example.com");
        payload.put("hire_date", "03/31/2026");

        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(1L), eq(2L)))
            .thenReturn(1);

        var error = assertThrows(IllegalArgumentException.class, () -> service.updateEmployee(1L, payload));
        assertEquals("hire_date must use YYYY-MM-DD format.", error.getMessage());
    }

    @Test
    void updateEmployeeRejectsMissingAssignmentFields() {
        var service = new HrEmployeeService(jdbcTemplate, hrAttendanceService);
        var payload = new HashMap<String, Object>();
        payload.put("id", 2L);
        payload.put("first_name", "Test");
        payload.put("last_name", "Employee");
        payload.put("email", "test@example.com");
        payload.put("salary", "5200");

        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(1L), eq(2L)))
            .thenReturn(1);

        var error = assertThrows(IllegalArgumentException.class, () -> service.updateEmployee(1L, payload));
        assertEquals("position is required.", error.getMessage());
    }

    @Test
    void updateEmployeeRejectsMissingDailySalary() {
        var service = new HrEmployeeService(jdbcTemplate, hrAttendanceService);
        var payload = new HashMap<String, Object>();
        payload.put("id", 2L);
        payload.put("first_name", "Test");
        payload.put("last_name", "Employee");
        payload.put("email", "test@example.com");
        payload.put("position", "HR Analyst");
        payload.put("department", "People Ops");
        payload.put("unit_id", 5);
        payload.put("business_id", 5);
        payload.put("salary_type", "daily");
        payload.put("salary", "");

        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(1L), eq(2L)))
            .thenReturn(1);
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(5L), eq(1L)))
            .thenReturn(1);
        when(jdbcTemplate.query(anyString(), any(RowMapper.class), eq(5L), eq(1L)))
            .thenAnswer(invocation -> {
                @SuppressWarnings("unchecked")
                var rowMapper = (RowMapper<Object>) invocation.getArgument(1);
                ResultSet rs = mock(ResultSet.class);
                when(rs.getLong("id")).thenReturn(5L);
                when(rs.getLong("unit_id")).thenReturn(0L);
                when(rs.wasNull()).thenReturn(true);
                return List.of(rowMapper.mapRow(rs, 0));
            });

        var error = assertThrows(IllegalArgumentException.class, () -> service.updateEmployee(1L, payload));
        assertEquals("salary is required for daily employees.", error.getMessage());
    }

    private ResultSet employeeResultSet() throws SQLException {
        ResultSet rs = mock(ResultSet.class);
        when(rs.getLong("id")).thenReturn(2L);
        when(rs.getString("first_name")).thenReturn("Second");
        when(rs.getString("last_name")).thenReturn("Empleado");
        when(rs.getString("email")).thenReturn("second.employee.spring@example.com");
        when(rs.getString("employee_number")).thenReturn(null);
        when(rs.getString("status")).thenReturn("active");
        when(rs.getString("position")).thenReturn("Senior Analyst");
        when(rs.getString("department")).thenReturn("Finance");
        when(rs.getString("phone")).thenReturn(null);
        when(rs.getString("unit_name")).thenReturn(null);
        when(rs.getString("business_name")).thenReturn(null);
        when(rs.getString("pay_period")).thenReturn("weekly");
        when(rs.getString("salary_type")).thenReturn("daily");
        when(rs.getString("contract_type")).thenReturn("permanent");
        when(rs.getString("termination_reason_type")).thenReturn(null);
        when(rs.getString("termination_reason_code")).thenReturn(null);
        when(rs.getString("termination_summary")).thenReturn(null);
        when(rs.getObject("hire_date")).thenReturn(null);
        when(rs.getObject("contract_start_date")).thenReturn(null);
        when(rs.getObject("contract_end_date")).thenReturn(null);
        when(rs.getObject("termination_date")).thenReturn(null);
        when(rs.getObject("last_working_day")).thenReturn(null);
        when(rs.getBigDecimal("salary")).thenReturn(new BigDecimal("6500.00"));
        when(rs.getBigDecimal("hourly_rate")).thenReturn(null);
        when(rs.getLong("unit_id")).thenReturn(0L);
        when(rs.getLong("business_id")).thenReturn(0L);
        when(rs.wasNull()).thenReturn(true);
        return rs;
    }
}
