package com.indice.erp.hr;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.sql.ResultSet;
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

    @Test
    void listEmployeesAllowsNullOptionalColumns() throws Exception {
        var service = new HrEmployeeService(jdbcTemplate);

        when(jdbcTemplate.query(anyString(), org.mockito.ArgumentMatchers.<RowMapper<Map<String, Object>>>any(), eq(1L)))
            .thenAnswer(invocation -> {
                @SuppressWarnings("unchecked")
                var rowMapper = (RowMapper<Map<String, Object>>) invocation.getArgument(1);
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
                when(rs.getObject("hire_date")).thenReturn(null);
                when(rs.getBigDecimal("salary")).thenReturn(new BigDecimal("6500.00"));
                return List.of(rowMapper.mapRow(rs, 0));
            });

        when(jdbcTemplate.queryForObject(anyString(), eq(BigDecimal.class), eq(1L)))
            .thenReturn(new BigDecimal("6500.00"));

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
    void updateEmployeeThrowsWhenRowDoesNotExist() {
        var service = new HrEmployeeService(jdbcTemplate);
        var payload = new HashMap<String, Object>();
        payload.put("id", 999L);

        when(jdbcTemplate.update(
            anyString(),
            org.mockito.ArgumentMatchers.<Object>any(),
            org.mockito.ArgumentMatchers.<Object>any(),
            org.mockito.ArgumentMatchers.<Object>any(),
            org.mockito.ArgumentMatchers.<Object>any(),
            org.mockito.ArgumentMatchers.<Object>any(),
            org.mockito.ArgumentMatchers.<Object>any(),
            org.mockito.ArgumentMatchers.<Object>any(),
            org.mockito.ArgumentMatchers.<Object>any(),
            org.mockito.ArgumentMatchers.<Object>any(),
            org.mockito.ArgumentMatchers.<Object>any(),
            org.mockito.ArgumentMatchers.<Object>any()
        )).thenReturn(0);

        assertThrows(NoSuchElementException.class, () -> service.updateEmployee(1L, payload));
    }

    @Test
    void updateEmployeeRejectsInvalidHireDate() {
        var service = new HrEmployeeService(jdbcTemplate);
        var payload = new HashMap<String, Object>();
        payload.put("id", 2L);
        payload.put("hire_date", "03/31/2026");

        var error = assertThrows(IllegalArgumentException.class, () -> service.updateEmployee(1L, payload));
        assertEquals("hire_date must use YYYY-MM-DD format.", error.getMessage());
    }
}
