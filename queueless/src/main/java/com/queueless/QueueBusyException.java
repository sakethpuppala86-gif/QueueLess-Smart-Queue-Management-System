package com.queueless;

public class QueueBusyException extends RuntimeException {

    public QueueBusyException(String message) {
        super(message);
    }
}