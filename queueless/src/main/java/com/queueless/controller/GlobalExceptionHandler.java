package com.queueless.controller;

import com.queueless.QueueBusyException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(QueueBusyException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> handleQueueBusyException(
            QueueBusyException exception) {

        return Map.of(
                "message",
                exception.getMessage()
        );
    }
}
