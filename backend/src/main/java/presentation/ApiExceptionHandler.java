package com.lasttrack.presentation;

import com.lasttrack.application.order.OrderNotFoundException;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.Map;

@RestControllerAdvice
// Es publica porque Spring debe detectarla como manejador global de errores de la API.
public class ApiExceptionHandler {
    @ExceptionHandler(OrderNotFoundException.class)
    ResponseEntity<Map<String, Object>> notFound(OrderNotFoundException ex) { return error(HttpStatus.NOT_FOUND, ex.getMessage()); }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class, MethodArgumentNotValidException.class})
    ResponseEntity<Map<String, Object>> badRequest(Exception ex) { return error(HttpStatus.BAD_REQUEST, ex.getMessage()); }

    // Es privado porque solo este manejador debe construir el formato uniforme de error.
    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of("timestamp", Instant.now(), "status", status.value(), "message", message));
    }
}
