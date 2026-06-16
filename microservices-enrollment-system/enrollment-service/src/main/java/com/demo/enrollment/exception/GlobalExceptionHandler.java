package com.demo.enrollment.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(
            RuntimeException ex, WebRequest request) {

        Map<String, String> errorDetails = new HashMap<>();
        String errorMessage = ex.getMessage() != null ? ex.getMessage() : "Une erreur est survenue";
        errorDetails.put("message", errorMessage);

        return ResponseEntity.badRequest()
                .header("X-Error", errorMessage)
                .body(errorDetails);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(
            Exception ex, WebRequest request) {

        Map<String, String> errorDetails = new HashMap<>();
        String errorMessage = ex.getMessage() != null ? ex.getMessage() : "Erreur serveur";
        errorDetails.put("message", errorMessage);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .header("X-Error", errorMessage)
                .body(errorDetails);
    }
}
