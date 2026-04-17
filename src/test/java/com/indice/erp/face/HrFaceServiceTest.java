package com.indice.erp.face;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.indice.erp.storage.ObjectStorageProperties;
import com.indice.erp.storage.ObjectStorageService;
import java.sql.ResultSet;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

@ExtendWith(MockitoExtension.class)
class HrFaceServiceTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @Mock
    private ObjectStorageService objectStorageService;

    @Mock
    private FaceVerificationClient faceVerificationClient;

    private HrFaceService service;

    @BeforeEach
    void setUp() {
        var properties = new FaceVerificationProperties();
        properties.setEnabled(true);
        when(faceVerificationClient.isEnabled()).thenReturn(true);
        service = new HrFaceService(
            jdbcTemplate,
            objectStorageService,
            new ObjectStorageProperties(),
            properties,
            faceVerificationClient,
            new ObjectMapper()
        );
    }

    @Test
    void getEnrollmentReturnsNotEnrolledPlaceholderWhenEmployeeHasNoEnrollment() {
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(1L), eq(33L))).thenReturn(1);
        when(jdbcTemplate.query(
            anyString(),
            org.mockito.ArgumentMatchers.<RowMapper<Object>>any(),
            eq(1L),
            eq(33L)
        )).thenReturn(List.of());

        var response = service.getEnrollment(1L, 33L);

        @SuppressWarnings("unchecked")
        var enrollment = (Map<String, Object>) response.get("enrollment");

        assertNotNull(enrollment);
        assertNull(enrollment.get("id"));
        assertEquals(33L, enrollment.get("employee_id"));
        assertEquals("not_enrolled", enrollment.get("status"));
        assertNull(enrollment.get("expires_at"));
        assertNull(enrollment.get("enrolled_at"));
    }

    @Test
    void getEnrollmentSupportsNullableEnrollmentDates() throws Exception {
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(1L), eq(51L))).thenReturn(1);
        when(jdbcTemplate.query(
            anyString(),
            org.mockito.ArgumentMatchers.<RowMapper<Object>>any(),
            eq(1L),
            eq(51L)
        )).thenAnswer(invocation -> {
            @SuppressWarnings("unchecked")
            var rowMapper = (RowMapper<Object>) invocation.getArgument(1);
            ResultSet rs = mock(ResultSet.class);
            when(rs.getLong("id")).thenReturn(7L);
            when(rs.getLong("company_id")).thenReturn(1L);
            when(rs.getLong("employee_id")).thenReturn(51L);
            when(rs.getString("status")).thenReturn("pending");
            when(rs.getObject("expires_at", LocalDateTime.class)).thenReturn(LocalDateTime.of(2026, 4, 16, 15, 30));
            when(rs.getObject("enrolled_at", LocalDateTime.class)).thenReturn(null);
            when(rs.getObject("deleted_at", LocalDateTime.class)).thenReturn(null);
            when(rs.getObject("created_by", Long.class)).thenReturn(1L);
            return List.of(rowMapper.mapRow(rs, 0));
        });

        var response = service.getEnrollment(1L, 51L);

        @SuppressWarnings("unchecked")
        var enrollment = (Map<String, Object>) response.get("enrollment");

        assertNotNull(enrollment);
        assertEquals(7L, enrollment.get("id"));
        assertEquals(51L, enrollment.get("employee_id"));
        assertEquals("pending", enrollment.get("status"));
        assertEquals("2026-04-16T15:30", enrollment.get("expires_at"));
        assertNull(enrollment.get("enrolled_at"));
    }
}
