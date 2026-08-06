package com.backend.abrazamente.exception;

import java.time.OffsetDateTime;
import java.util.Map;

public record ErrorResponse(
        OffsetDateTime timestamp,
        int status,
        String error,
        String message,
        Map<String, String> errors
) {

    public static ErrorResponse of(int status, String error, String message) {
        return new ErrorResponse(OffsetDateTime.now(), status, error, message, null);
    }

    public static ErrorResponse of(int status, String error, String message, Map<String, String> errors) {
        return new ErrorResponse(OffsetDateTime.now(), status, error, message, errors);
    }
}
