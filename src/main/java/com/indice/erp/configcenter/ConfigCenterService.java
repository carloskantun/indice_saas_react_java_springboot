package com.indice.erp.configcenter;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ConfigCenterService {

    private final JdbcTemplate jdbcTemplate;

    public ConfigCenterService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Map<String, Object> getEmpresa(long companyId) {
        var companyRows = jdbcTemplate.query(
            "SELECT id, name, logo_url FROM companies WHERE id = ? LIMIT 1",
            (rs, rowNum) -> {
                var row = new LinkedHashMap<String, Object>();
                row.put("id", rs.getLong("id"));
                row.put("nombre_empresa", safe(rs.getString("name")));
                row.put("logo_url", safe(rs.getString("logo_url")));
                return row;
            },
            companyId
        );

        if (companyRows.isEmpty()) {
            throw new IllegalArgumentException("Company not found.");
        }

        var map = buildStructureMap(companyId);
        var estructura = map.isEmpty() ? "simple" : "multi";

        var empresa = new LinkedHashMap<>(companyRows.getFirst());
        empresa.put("plan_id", null);
        empresa.put("industria", "");
        empresa.put("modelo_negocio", "");
        empresa.put("descripcion", "");
        empresa.put("moneda", "");
        empresa.put("zona_horaria", "");
        empresa.put("tamano_empresa", "");
        empresa.put("colaboradores", 0);
        empresa.put("estructura", estructura);
        empresa.put("empresa_template", new LinkedHashMap<>());
        empresa.put("map", map);
        return empresa;
    }

    public Object getConfig(long companyId) {
        var empresa = getEmpresa(companyId);
        var config = new LinkedHashMap<String, Object>();
        config.put("estructura", empresa.get("estructura"));
        config.put("colaboradores", empresa.get("colaboradores"));
        config.put("empresa_template", empresa.get("empresa_template"));
        config.put("map", empresa.get("map"));
        return config;
    }

    public Map<String, Object> getCurrentUser(long userId, String currentRole) {
        var rows = jdbcTemplate.query(
            "SELECT id, email, COALESCE(full_name, '') AS full_name FROM users WHERE id = ? LIMIT 1",
            (rs, rowNum) -> {
                var fullName = safe(rs.getString("full_name"));
                var parsed = splitFullName(fullName);

                var user = new LinkedHashMap<String, Object>();
                user.put("id", rs.getLong("id"));
                user.put("email", safe(rs.getString("email")));
                user.put("apodo", "");
                user.put("nombres", parsed.firstName());
                user.put("apellidos", parsed.lastName());
                user.put("primer_nombre", parsed.firstName());
                user.put("segundo_nombre", "");
                user.put("apellido_paterno", parsed.lastName());
                user.put("apellido_materno", "");
                user.put("telefono", "");
                user.put("preferred_language", "es-419");
                user.put("avatar_url", "");
                user.put("role", currentRole);
                return user;
            },
            userId
        );

        if (rows.isEmpty()) {
            throw new IllegalArgumentException("User not found.");
        }
        return rows.getFirst();
    }

    public Map<String, Object> getUsers(long companyId) {
        var users = jdbcTemplate.query(
            """
                SELECT u.id,
                       u.email,
                       COALESCE(u.full_name, '') AS full_name,
                       uc.id AS user_company_id,
                       COALESCE(uc.role, 'user') AS role,
                       COALESCE(uc.status, 'active') AS status
                FROM users u
                INNER JOIN user_companies uc ON uc.user_id = u.id
                WHERE uc.company_id = ?
                ORDER BY u.full_name ASC, u.email ASC
                """,
            (rs, rowNum) -> {
                var name = splitFullName(safe(rs.getString("full_name")));
                var user = new LinkedHashMap<String, Object>();
                user.put("id", rs.getLong("id"));
                user.put("user_company_id", rs.getLong("user_company_id"));
                user.put("apodo", null);
                user.put("nombres", name.firstName());
                user.put("apellidos", name.lastName());
                user.put("email", safe(rs.getString("email")));
                user.put("telefono", null);
                user.put("role", safe(rs.getString("role")));
                user.put("department", null);
                user.put("status", safe(rs.getString("status")));
                user.put("created_at", null);
                user.put("business_id", null);
                user.put("module_slugs", listModuleSlugs(rs.getLong("user_company_id")));
                user.put("is_protected", Set.of("root", "superadmin").contains(safe(rs.getString("role"))));
                user.put("source", "user");
                return user;
            },
            companyId
        );

        var catalogBusinesses = jdbcTemplate.query(
            """
                SELECT id, name
                FROM businesses
                WHERE company_id = ?
                  AND (status = 'active' OR status IS NULL OR status = '')
                ORDER BY name ASC
                """,
            (rs, rowNum) -> Map.of(
                "id", rs.getLong("id"),
                "name", safe(rs.getString("name"))
            ),
            companyId
        );

        var catalogModules = jdbcTemplate.query(
            "SELECT slug, name FROM modules WHERE COALESCE(is_active, 1) = 1 ORDER BY sort_order ASC, name ASC",
            (rs, rowNum) -> Map.of(
                "slug", safe(rs.getString("slug")),
                "name", safe(rs.getString("name"))
            )
        );

        var catalog = new LinkedHashMap<String, Object>();
        catalog.put("businesses", catalogBusinesses);
        catalog.put("modules", catalogModules);

        return Map.of(
            "users", users,
            "catalog", catalog
        );
    }

    @Transactional
    public Map<String, Object> saveStructure(long companyId, Map<String, Object> payload) {
        var estructura = value(payload, "modo", "estructura");
        if (!"multi".equals(estructura)) {
            estructura = "simple";
        }

        var map = normalizeMap(payload);
        if ("multi".equals(estructura) && map.isEmpty()) {
            throw new IllegalArgumentException("At least one unit is required in multi mode.");
        }

        jdbcTemplate.update("DELETE FROM businesses WHERE company_id = ?", companyId);
        jdbcTemplate.update("DELETE FROM units WHERE company_id = ?", companyId);

        for (var unit : map) {
            jdbcTemplate.update(
                "INSERT INTO units (company_id, name, status) VALUES (?, ?, 'active')",
                companyId,
                unit.name()
            );
            var unitId = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Long.class);

            for (var business : unit.businesses()) {
                jdbcTemplate.update(
                    "INSERT INTO businesses (company_id, unit_id, name, status) VALUES (?, ?, ?, 'active')",
                    companyId,
                    unitId,
                    business
                );
            }
        }

        var response = new LinkedHashMap<String, Object>();
        response.put("modo", estructura);
        response.put("colaboradores", 0);
        response.put("unidades_aprox", map.size());
        response.put("map", buildStructureMap(companyId));
        return response;
    }

    public Map<String, Object> saveEmpresa(long companyId, Map<String, Object> payload) {
        var name = value(payload, "nombre_empresa");
        if (!name.isBlank()) {
            jdbcTemplate.update("UPDATE companies SET name = ? WHERE id = ?", name, companyId);
        }

        var data = new LinkedHashMap<String, Object>();
        data.put("nombre_empresa", name);
        data.put("industria", value(payload, "industria"));
        data.put("descripcion", value(payload, "descripcion"));
        data.put("tamano_empresa", value(payload, "tamano_empresa"));
        data.put("modelo_negocio", value(payload, "modelo_negocio"));
        data.put("moneda", value(payload, "moneda"));
        data.put("zona_horaria", value(payload, "zona_horaria", "tz"));
        return data;
    }

    private List<String> listModuleSlugs(long userCompanyId) {
        return jdbcTemplate.query(
            "SELECT DISTINCT module_slug FROM user_company_module_roles WHERE user_company_id = ? ORDER BY module_slug ASC",
            (rs, rowNum) -> safe(rs.getString("module_slug")),
            userCompanyId
        );
    }

    private List<Map<String, Object>> buildStructureMap(long companyId) {
        var businessesByUnit = new LinkedHashMap<Long, List<Map<String, Object>>>();
        jdbcTemplate.query(
            """
                SELECT id, unit_id, name
                FROM businesses
                WHERE company_id = ?
                  AND (status = 'active' OR status IS NULL OR status = '')
                ORDER BY id ASC
                """,
            rs -> {
                var unitId = rs.getLong("unit_id");
                businessesByUnit.computeIfAbsent(unitId, ignored -> new ArrayList<>()).add(Map.of(
                    "name", safe(rs.getString("name"))
                ));
            },
            companyId
        );

        return jdbcTemplate.query(
            """
                SELECT id, name
                FROM units
                WHERE company_id = ?
                  AND (status = 'active' OR status IS NULL OR status = '')
                ORDER BY id ASC
                """,
            (rs, rowNum) -> {
                var row = new LinkedHashMap<String, Object>();
                row.put("name", safe(rs.getString("name")));
                row.put("businesses", businessesByUnit.getOrDefault(rs.getLong("id"), List.of()));
                return row;
            },
            companyId
        );
    }

    private List<UnitInput> normalizeMap(Map<String, Object> payload) {
        var result = new ArrayList<UnitInput>();

        var rawMap = payload.get("map");
        if (rawMap instanceof List<?> mapList) {
            for (var unitCandidate : mapList) {
                if (!(unitCandidate instanceof Map<?, ?> unitMap)) {
                    continue;
                }
                var name = safe(objectString(unitMap.get("name")));
                if (name.isBlank()) {
                    continue;
                }

                var businesses = new ArrayList<String>();
                var rawBusinesses = unitMap.get("businesses");
                if (rawBusinesses instanceof List<?> businessList) {
                    for (var businessCandidate : businessList) {
                        if (businessCandidate instanceof Map<?, ?> businessMap) {
                            var businessName = safe(objectString(businessMap.get("name")));
                            if (!businessName.isBlank()) {
                                businesses.add(businessName);
                            }
                        } else {
                            var businessName = safe(objectString(businessCandidate));
                            if (!businessName.isBlank()) {
                                businesses.add(businessName);
                            }
                        }
                    }
                }

                result.add(new UnitInput(name, businesses));
            }
        }

        if (!result.isEmpty()) {
            return result;
        }

        var rawUnits = payload.get("unidades");
        if (rawUnits instanceof List<?> unitsList) {
            for (var unitCandidate : unitsList) {
                if (!(unitCandidate instanceof Map<?, ?> unitMap)) {
                    continue;
                }
                var name = safe(objectString(unitMap.get("nombre")));
                if (name.isBlank()) {
                    name = safe(objectString(unitMap.get("name")));
                }
                if (name.isBlank()) {
                    continue;
                }

                var businesses = new ArrayList<String>();
                var rawBusinesses = unitMap.get("negocios");
                if (!(rawBusinesses instanceof List<?>)) {
                    rawBusinesses = unitMap.get("businesses");
                }

                if (rawBusinesses instanceof List<?> businessList) {
                    for (var businessCandidate : businessList) {
                        if (businessCandidate instanceof Map<?, ?> businessMap) {
                            var businessName = safe(objectString(businessMap.get("nombre")));
                            if (businessName.isBlank()) {
                                businessName = safe(objectString(businessMap.get("name")));
                            }
                            if (!businessName.isBlank()) {
                                businesses.add(businessName);
                            }
                        } else {
                            var businessName = safe(objectString(businessCandidate));
                            if (!businessName.isBlank()) {
                                businesses.add(businessName);
                            }
                        }
                    }
                }

                result.add(new UnitInput(name, businesses));
            }
        }

        return result;
    }

    private String value(Map<String, Object> payload, String... keys) {
        for (var key : keys) {
            var value = payload.get(key);
            if (value instanceof String string && !string.isBlank()) {
                return string.trim();
            }
        }
        return "";
    }

    private String objectString(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private NameParts splitFullName(String fullName) {
        var normalized = safe(fullName).trim();
        if (normalized.isBlank()) {
            return new NameParts("", "");
        }
        var parts = normalized.split("\\s+");
        if (parts.length == 1) {
            return new NameParts(parts[0], "");
        }
        var firstName = String.join(" ", java.util.Arrays.copyOf(parts, parts.length - 1));
        return new NameParts(firstName, parts[parts.length - 1]);
    }

    private record NameParts(
        String firstName,
        String lastName
    ) {
    }

    private record UnitInput(
        String name,
        List<String> businesses
    ) {
    }
}
