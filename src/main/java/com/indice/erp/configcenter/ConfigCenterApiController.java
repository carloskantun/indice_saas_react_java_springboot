package com.indice.erp.configcenter;

import jakarta.servlet.http.HttpSession;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.indice.erp.auth.SessionAuthService;

@RestController
@RequestMapping("/api/v1/config-center")
public class ConfigCenterApiController {

    private final SessionAuthService sessionAuthService;
    private final ConfigCenterService configCenterService;

    public ConfigCenterApiController(
        SessionAuthService sessionAuthService,
        ConfigCenterService configCenterService
    ) {
        this.sessionAuthService = sessionAuthService;
        this.configCenterService = configCenterService;
    }

    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        var current = sessionAuthService.currentUser(session);
        if (current.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        return ResponseEntity.ok(configCenterService.getCurrentUser(current.get().userId(), current.get().role()));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers(HttpSession session) {
        var current = sessionAuthService.currentUser(session);
        if (current.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        return ResponseEntity.ok(configCenterService.getUsers(current.get().companyId()));
    }

    @GetMapping("/company")
    public ResponseEntity<?> getEmpresa(HttpSession session) {
        var current = sessionAuthService.currentUser(session);
        if (current.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        return ResponseEntity.ok(configCenterService.getEmpresa(current.get().companyId()));
    }

    @GetMapping("/config")
    public ResponseEntity<?> getConfig(HttpSession session) {
        var current = sessionAuthService.currentUser(session);
        if (current.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        return ResponseEntity.ok(configCenterService.getConfig(current.get().companyId()));
    }

    @PutMapping("/business-structure")
    public ResponseEntity<?> saveConfig(HttpSession session, @RequestBody Map<String, Object> payload) {
        var current = sessionAuthService.currentUser(session);
        if (current.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        try {
            return ResponseEntity.ok(configCenterService.saveStructure(current.get().companyId(), payload));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @PutMapping("/company")
    public ResponseEntity<?> saveEmpresa(HttpSession session, @RequestBody Map<String, Object> payload) {
        var current = sessionAuthService.currentUser(session);
        if (current.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        var result = new LinkedHashMap<String, Object>();
        result.put("logo", null);
        result.put("data", configCenterService.saveEmpresa(current.get().companyId(), payload));
        result.put("message", "Company data saved");
        return ResponseEntity.ok(result);
    }
}
